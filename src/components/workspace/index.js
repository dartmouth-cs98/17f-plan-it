import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import Channel from '../../channels'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import NavBar from '../nav_bar/index.js'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Map from '../map/index.js'
import DownloadTrip from '../download_trip/index.js'
import { fetchTrip, fetchCards, insertCard, updateCard, updateCards, deleteCard, fetchSuggestions } from '../../actions/index.js'
require('./index.scss')

const DEFAULT_DURATION = 3600000
const DAY_NUMBER = 1
const TRAVEL_TIME = 900000
const CATEGORIES = [
	null,
	'food',
	'hotels',
	'rentals',
	'fitness & instruction',
	'parks'
]

class Workspace extends Component {
	constructor(props) {
		super(props)

		this.state = {
			day: DAY_NUMBER,
			selected: null,
			category: 0,
			pinLat: null,
			pinLong: null,
			cards: [],
      channel: null
		}

		this.dayForward = this.dayForward.bind(this)
		this.dayBackward = this.dayBackward.bind(this)
		this.selectCategory = this.selectCategory.bind(this)
		this.searchSuggestions = this.searchSuggestions.bind(this)
		this.addCard = this.addCard.bind(this)
		this.formatCards = this.formatCards.bind(this)
		this.formatSuggestions = this.formatSuggestions.bind(this)
		this.onDragEnd = this.onDragEnd.bind(this)
    this.sendLiveUpdate = this.sendLiveUpdate.bind(this)
    this.updateCardState = this.updateCardState.bind(this)
	}

	componentDidMount() {
		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

		this.setState({ tripId })

		this.props.fetchTrip(tripId)
		this.props.fetchCards(tripId, DAY_NUMBER)

    const channel = new Channel("lobby", this.updateCardState)
    this.setState({channel: channel})
	}

  componentWillReceiveProps(nextProps) {
    this.setState({ cards: nextProps.cards})
  }

  updateCardState(payload) {
    console.log("payload", payload)
    this.setState({cards: payload.body})
  }

  sendLiveUpdate() {
    const cards = this.state.cards;
    this.state.channel.send(cards)
  }

	dayForward() {
		const tripStart = this.props.trips[0] ? this.props.trips[0].start_time : null
		const tripEnd = this.props.trips[0] ? this.props.trips[0].end_time : null
		const tripDuration = (tripStart && tripEnd) ? Math.round(((new Date(tripEnd)).getTime() - (new Date(tripStart)).getTime()) / (1000*60*60*24)) : null

		if (this.state.day < tripDuration) {
			const newDay = this.state.day + 1
			this.setState({
				day: newDay,
				selected: null,
				category: 0,
				pinLat: null,
				pinLong: null
			})
			const path = window.location.pathname.split(':')
			const tripId = _.last(path)
			this.props.fetchCards(tripId, newDay)
		}
	}

	dayBackward() {
		if (this.state.day > 1) {
			const newDay = this.state.day - 1
			this.setState({
				day: newDay,
				selected: null,
				category: 0
			})
			const path = window.location.pathname.split(':')
			const tripId = _.last(path)
			this.props.fetchCards(tripId, newDay)
		}
	}

	selectCategory(event, val) {
		if (0 <= val < CATEGORIES.length) {
			this.setState({ category: val })
			const { pinLat, pinLong } = this.state
			if (!_.isNull(pinLat) && !_.isNull(pinLong)) {
				this.props.fetchSuggestions(pinLat, pinLong, CATEGORIES[val])
			}
		}
	}

	searchSuggestions(card) {
		this.props.fetchSuggestions(card.lat, card.long, CATEGORIES[this.state.category])
		this.setState({
			pinLat: card.lat,
			pinLong: card.long
		})
	}

	addCard(card) {
		const cards = this.formatCards(this.props.cards)

		if (!_.isNull(this.state.selected)) {
			const index = _.findIndex(cards, (card) => {
				return this.state.selected.start_time === card.start_time && this.state.selected.end_time === card.end_time
			})

			const duration = (new Date(this.state.selected.end_time)).getTime() - (new Date(this.state.selected.start_time)).getTime()
			if (duration >= DEFAULT_DURATION + TRAVEL_TIME) {
				let startTime = (new Date(this.state.selected.start_time)).getTime()

				if (index > 0) {
					startTime += TRAVEL_TIME
				}

				const path = window.location.pathname.split(':')
				const tripId = _.last(path)

				this.props.insertCard([{
					...card,
				  travel_duration: TRAVEL_TIME,
				  start_time: (new Date(startTime)),
				  end_time: (new Date(startTime + DEFAULT_DURATION)),
				  trip_id: tripId,
				  day_number: this.state.day
				}], tripId, this.state.day)

				this.setState({ selected: null })
			}
		}
	}

	formatCards(cards) {
		let cardList = []
		let startCard
		let prevEnd
		let startOfDay
		let cityLat
		let cityLong
		let cityStart
		let cityEnd

		_.each(cards, (card) => {
			if (card.type === 'city') {
				cityLat = card.lat
				cityLong = card.long
				cityStart = new Date(card.start_time)
				cityEnd = new Date(card.end_time)
				cardList.push(card)
				// set the base location
				return
			}

			const cardStart = new Date(card.start_time)

			const travelStart = new Date(cardStart.getTime() - TRAVEL_TIME)
			const travel = {
				type: 'travel',
				start_time: travelStart.toString(),
				end_time: card.start_time,
				travelType: card.travelType,
				destination: card.name
			}

			cardList.push(travel)

			cardList.push(card)

			prevEnd = new Date(card.end_time)
		})

		// If there are no cards in the day, search for suggestions based on the city
		if (_.isNil(this.props.suggestions) || this.props.suggestions.length === 0 || _.isNull(this.state.pinLat) || _.isNull(this.state.pinLong)) {
			this.props.fetchSuggestions(cityLat, cityLong, CATEGORIES[this.state.category])
			if (this.state.pinLat != cityLat && this.state.pinLong != cityLong) {
				this.setState({
					pinLat: cityLat,
					pinLong: cityLong
				})
			}
		}

		return cardList
	}

	formatSuggestions() {
		return _.map(this.props.suggestions, (suggestion) => {
			return {
				name: suggestion.name,
				image_url: suggestion.image_url,
				yelp_url: suggestion.url,
				price: suggestion.price,
				lat: suggestion.coordinates.latitude,
				long: suggestion.coordinates.longitude,
				phone: suggestion.phone,
				display_phone: suggestion.display_phone,
				type: suggestion.categories[0].alias,
				description: suggestion.categories[0].title,
			}
		})
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return
		} else if (result.destination.droppableId !== result.source.droppableId) {
			if (result.destination.droppableId === 'suggestions-droppable') {
				// remove an item from the itinerary

			} else {
				// add an item to the itinerary by dragging
				const itinerary = Array.from(this.props.cards)
				const [city] = _.remove(itinerary, (card) => {
					return card.type === 'city'
				})
				const suggestions = Array.from(this.formatSuggestions())
				const [item] = suggestions.splice(result.source.index, 1)

				// get the start time of the card that you're pushing down
				let start
				if (itinerary.length === 0) {
					start = new Date(city.start_time)
				} else {
					start = result.destination.index === itinerary.length ?
						new Date(itinerary[itinerary.length - 1].end_time) : new Date(itinerary[result.destination.index].start_time)
				}

				// replace start time
				const path = window.location.pathname.split(':')
				const tripId = _.last(path)

				const inserted = {
					...item,
					id: 0,
				  travel_duration: TRAVEL_TIME,
				  start_time: start,
				  end_time: (new Date(start.getTime() + DEFAULT_DURATION)),
				  trip_id: tripId,
				  day_number: this.state.day
				}

				// add the new card to the itinerary
				itinerary.splice(result.destination.index, 0, inserted)

				// shift each card back by the duration of the card removed
				for (let i = result.destination.index + 1; i < itinerary.length; i++) {
					const card = itinerary[i]

					_.assign(card, {
						'start_time': new Date((new Date(card.start_time)).getTime() + DEFAULT_DURATION),
						'end_time': new Date((new Date(card.end_time)).getTime() + DEFAULT_DURATION)
					})
				}

				// add the city card back
				itinerary.splice(0, 0, city)

        this.setState({cards: itinerary})
        this.sendLiveUpdate()

				// update cards with new itinerary
				//this.props.updateCards(itinerary, tripId, this.state.day)
			}
		} else if (result.destination.droppableId === 'suggestions-droppable') {
			// reorder suggestions

		} else {
			// reorder items in the itinerary
			const itinerary = Array.from(this.props.cards)
			const [city] = _.remove(itinerary, (card) => {
				return card.type === 'city'
			})

			// get the start time of the item you're trying to replace
			const start = result.destination.index > result.source.index ?
				new Date(itinerary[result.destination.index].end_time) : new Date(itinerary[result.destination.index].start_time)

			// get the info of the object your dragging
			const [removed] = itinerary.splice(result.source.index, 1)
			const duration = (new Date(removed.end_time)).getTime() - (new Date(removed.start_time)).getTime()

			// update the start and end times of the item being dragged
			const item = _.assignIn({}, removed, {
				'start_time': start,
				'end_time': new Date(start.getTime() + duration)
			})

			// add the item back into the itinerary in the right place
			itinerary.splice(result.destination.index, 0, item)

			let endIndex

			// indices show range of cards that need to update their times
			if (result.destination.index > result.source.index) {
				endIndex = itinerary.length
			} else {
				endIndex = result.source.index + 1
			}

			for (let i = result.destination.index + 1; i < endIndex; i++) {
				const card = itinerary[i]

				// shift each card back by the duration of the card removed
				_.assign(card, {
					'start_time': new Date((new Date(card.start_time)).getTime() + duration),
					'end_time': new Date((new Date(card.end_time)).getTime() + duration)
				})
			}

			// add the city card back in
			itinerary.splice(0, 0, city)

			const path = window.location.pathname.split(':')
			const tripId = _.last(path)
      this.setState({cards: itinerary})
      this.sendLiveUpdate()
			//this.props.updateCards(itinerary, tripId, this.state.day)
		}
	}

	render() {
		const cards = this.formatCards(this.state.cards)
		const [city] = _.filter(cards, (card) => {
			return card.type === 'city'
		})
		const suggestions = this.formatSuggestions()
		const path = window.location.pathname.split(':')
		const tripId = _.last(path)
		const tripStart = this.props.trips[0] ? this.props.trips[0].start_time : null
		const tripEnd = this.props.trips[0] ? this.props.trips[0].end_time : null
		const tripDuration = (tripStart && tripEnd) ? Math.round(((new Date(tripEnd)).getTime() - (new Date(tripStart)).getTime()) / (1000*60*60*24)) : null
		return (
			<div id='workspace'>
				<NavBar background={'globe_background'}/>
				<Toolbar
					tripName={this.props.trips[0] ? this.props.trips[0].name : 'My Trip'}
					published={this.props.trips[0] ? this.props.trips[0].published : false}
					tripId={tripId}
				/>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<DownloadTrip tripId={tripId}/>
          <div>
            <button onClick={this.sendLiveUpdate}>
              Send live message
            </button>
          </div>
					<div className='planner'>
						<Suggestions
							addCard={this.addCard}
							suggestions={suggestions}
							category={this.state.category}
							selectCategory={this.selectCategory}
						/>
						<Itinerary
							tripId={tripId}
							cards={cards}
							day={this.state.day}
							searchSuggestions={this.searchSuggestions}
							selected={this.state.selected}
							updateCard={this.props.updateCard}
							removeCard={this.props.deleteCard}
							dayForward={this.dayForward}
							dayBackward={this.dayBackward}
							numDays={tripDuration}
						/>
						<Map
							isInfoOpen={false}
							isMarkerShown={true}
							MarkerPosition={{ lat: this.state.pinLat || city ? city.lat : null, lng: this.state.pinLong || city ? city.long : null }}
							MarkerClusterArray={this.props.suggestions}
							center={{ lat: this.state.pinLat || city ? city.lat : null, lng: this.state.pinLong || city ? city.long : null }}
							infoMessage="Hello From Dartmouth"
							addCard={this.addCard}
						/>
					</div>
				</DragDropContext>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		trips: state.trips.trip,
		cards: state.cards.all,
		suggestions: state.cards.suggestions
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchTrip: (id) => {
			dispatch(fetchTrip(id))
		},
		fetchCards: (id, day) => {
			dispatch(fetchCards(id, day))
		},
		insertCard: (cards, trip, id) => {
			dispatch(insertCard(cards, trip, id))
		},
		updateCard: (cards, trip, id, day) => {
			dispatch(updateCard(cards, trip, id, day))
		},
		updateCards: (cards, trip, day) => {
			dispatch(updateCards(cards, trip, day))
		},
		deleteCard: (id, trip, day) => {
			dispatch(deleteCard(id, trip, day))
		},
		fetchSuggestions: (lat, long, categories=null) => {
			dispatch(fetchSuggestions(lat, long, categories))
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace))
