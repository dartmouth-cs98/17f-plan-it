import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { fetchTrip, fetchCards, insertCard, updateCard, updateCards, updateCardsLive, deleteCardLive, deleteCard, fetchSuggestions } from '../../actions/index.js'
import { mainChannel } from '../../channels'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import NavBar from '../nav_bar/index.js'
import Map from '../map/index.js'
import DownloadTrip from '../download_trip/index.js'

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
            category: 0,
            pinLat: null,
            pinLong: null,
        }

        this.dayForward = this.dayForward.bind(this)
        this.dayBackward = this.dayBackward.bind(this)
        this.selectCategory = this.selectCategory.bind(this)
        this.searchSuggestions = this.searchSuggestions.bind(this)
        this.formatCards = this.formatCards.bind(this)
        this.formatSuggestions = this.formatSuggestions.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.updateStartTime = this.updateStartTime.bind(this)
        this.sendLiveUpdate = this.sendLiveUpdate.bind(this)
        this.sendUpdates = this.sendUpdates.bind(this)
        this.sendDelete = this.sendDelete.bind(this)
        this.componentWillReceiveChannelUpdates = this.componentWillReceiveChannelUpdates.bind(this)
    }

  componentDidMount() {
    const path = window.location.pathname.split(':')
    const tripId = _.last(path)

    this.setState({ tripId })
    this.props.fetchTrip(tripId)
    this.props.fetchCards(tripId, DAY_NUMBER)

    if (this.props.user.email) {
      mainChannel.connect(tripId, this.props.user.email)
    } else { //connect anon
      console.log("connecting anon")
      mainChannel.connect(tripId, "foobar")
    }

    mainChannel.setCardFunctions(this.componentWillReceiveChannelUpdates())
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ cards: nextProps.cards})
  }

  //cleverly named function. Not a react function
  //this handles receiving websocket messages and updating the state
  componentWillReceiveChannelUpdates() {
    return {
      update: this.props.updateCardsLive,
      delete: this.props.deleteCardLive,
      logger: console.log
    }
  }

  //send card updates through the websocket
  sendLiveUpdate(cards) {
    const send_package = {cards, tripId: this.state.tripId}
    mainChannel.sendCards(send_package)
  }

  //delete a card through websocket
  sendDelete(card_id) {
    mainChannel.deleteCard(card_id)
    this.props.deleteCardLive(card_id)
  }

    // update cards with new itinerary
  sendUpdates(itinerary, tripId) {
    this.setState({cards: itinerary})
    this.sendLiveUpdate(itinerary)
    this.props.updateCardsLive(itinerary)
  }

	dayForward() {
		const tripStart = this.props.trips[0] ? this.props.trips[0].start_time : null
		const tripEnd = this.props.trips[0] ? this.props.trips[0].end_time : null
		const tripDuration = (tripStart && tripEnd) ? Math.round(((new Date(tripEnd)).getTime() - (new Date(tripStart)).getTime()) / (1000*60*60*24)) : null

		if (this.state.day < tripDuration) {
			const newDay = this.state.day + 1
			this.setState({
				day: newDay,
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
		// return _.map(this.props.suggestions, (suggestion) => {
			// return {
			// 	name: suggestion.name,
			// 	photo_url: suggestion.photo_url,
			// 	url: suggestion.url,
			// 	price: suggestion.price,
			// 	rating: suggestion.rating,
			// 	lat: suggestion.lat,
			// 	long: suggestion.long,
			// 	address: suggestion.address,
			// 	city: suggestion.city,
			// 	state: suggestion.state,
			// 	country: suggestion.country,
			// 	zip_code: suggestion.zip_code,
			// 	phone: suggestion.phone,
			// 	type: suggestion.type,
			// 	description: suggestion.description,
			// 	source: suggestion.source
			// }
		// })
		return this.props.suggestions
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

        this.sendUpdates(itinerary, tripId)
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
      this.sendUpdates(itinerary, tripId)
		}
	}

	updateStartTime(cardId, time) {
		const itinerary = _.map(Array.from(this.props.cards), _.clone)
		const index = _.findIndex(itinerary, (card) => {
			return card.id === cardId
		})

		// get a value representing the end of the day
		const dayEnd = new Date(itinerary[index].start_time)
		dayEnd.setHours(24, 0, 0, 0)

		// calculate the change in time to update
		const diff = (new Date(itinerary[index].start_time)).getTime() - (new Date(time)).getTime()

		if (diff < 0) {
			console.log(index, itinerary.length)
			// increase the start time of the card and all cards after it
			for (let i = index; i < itinerary.length; i++) {
				const card = itinerary[i]
				const endTime = new Date((new Date(card.end_time)).getTime() - diff)

				if (endTime.getTime() > dayEnd.getTime()) {
					// if the later cards would get pushed back to the next day, don't edit the start time
					return
				}

				_.assign(card, {
					'start_time': new Date((new Date(card.start_time)).getTime() - diff),
					'end_time': endTime
				})

				// stop updating following cards if there is no conflict
				if (i < itinerary.length - 1 && endTime.getTime() <= (new Date(itinerary[i + 1].start_time)).getTime()) {
					break
				}
			}
		} else if (diff > 0) {
			// shift card backwards in time if possible
			const startTime = new Date((new Date(itinerary[index].start_time)).getTime() - diff)

			if (index > 0 && itinerary[index - 1].type !== 'city' && startTime.getTime() >= (new Date(itinerary[index - 1].end_time)).getTime()) {
				_.assign(itinerary[index], {
					'start_time': startTime,
					'end_time': new Date((new Date(itinerary[index].end_time)).getTime() - diff)
				})
			} else if (index === 0 || itinerary[index - 1].type === 'city') {
				// check if it goes before midnight
				const dayStart = new Date(itinerary[index].start_time)
				dayStart.setHours(0, 0, 0, 0)

				if (startTime.getTime() >= dayStart.getTime()) {
					_.assign(itinerary[index], {
						'start_time': startTime,
						'end_time': new Date((new Date(itinerary[index].end_time)).getTime() - diff)
					})
				}
			}
		}

		const path = window.location.pathname.split(':')
		const tripId = _.last(path)
    this.sendUpdates(itinerary, tripId)		
	}

	render() {
		const cards = this.formatCards(this.state.cards)
		const [city] = _.filter(cards, (card) => { return card.type === 'city'})

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
					published={this.props.trips[0] ? this.props.trips[0].publish : false}
					tripId={tripId}
					readOnly={false}
				/>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<div className='planner'>
						<Suggestions
							suggestions={suggestions}
							category={this.state.category}
							selectCategory={this.selectCategory}
						/>
						<Itinerary
							tripId={tripId}
							cards={cards}
							day={this.state.day}
							searchSuggestions={this.searchSuggestions}
							updateCard={this.props.updateCard}
							removeCard={this.sendDelete}
							dayForward={this.dayForward}
							dayBackward={this.dayBackward}
							updateTime={this.updateStartTime}
							numDays={tripDuration}
							readOnly={false}
						/>
						<Map
							isInfoOpen={false}
							isMarkerShown={true}
							MarkerClusterArray={this.props.suggestions}
							itin_marker_array={this.props.cards.filter(function(item, idx) {return item.type !== 'city';})}
							center={{ lat: this.state.pinLat, lng: this.state.pinLong }}
							removeCard={this.sendDelete}
						/>
					</div>
				</DragDropContext>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
    return {
        user: state.users,
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
        updateCardsLive: (cards) => {
          dispatch(updateCardsLive(cards))
        },
        updateCards: (cards, trip, day) => {
            dispatch(updateCards(cards, trip, day))
        },
        deleteCard: (id, trip, day) => {
            dispatch(deleteCard(id, trip, day))
        },
        deleteCardLive: (id) => {
          dispatch(deleteCardLive(id))
        },
        fetchSuggestions: (lat, long, categories=null) => {
            dispatch(fetchSuggestions(lat, long, categories))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace))
