import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import NavBar from '../nav_bar/index.js'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Map from '../map/index.js'
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
			cards: []
		}

		this.dayForward = this.dayForward.bind(this)
		this.dayBackward = this.dayBackward.bind(this)
		this.selectCategory = this.selectCategory.bind(this)
		this.selectTime = this.selectTime.bind(this)
		this.addCard = this.addCard.bind(this)
		this.formatCards = this.formatCards.bind(this)
		this.onDragEnd = this.onDragEnd.bind(this)
	}

	componentDidMount() {
		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

		this.setState({ tripId })

		this.props.fetchTrip(tripId)
		this.props.fetchCards(tripId, DAY_NUMBER)
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
				category: 0
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

	selectTime(freeTime) {
		const cards = this.formatCards()
		let lat
		let long

		if (cards.length > 0) {
			if (freeTime.type === 'day') {
				this.props.fetchSuggestions(freeTime.lat, freeTime.long, CATEGORIES[this.state.category])
				this.setState({
					selected: freeTime,
					pinLat: freeTime.lat,
					pinLong: freeTime.long
				})
				return
			}

			const index = _.findIndex(cards, (card) => {
				return freeTime.start_time === card.start_time && freeTime.end_time === card.end_time
			})

			if (index > 0) {
				const prev = cards[index - 1]
				lat = prev.lat
				long = prev.long
				// use location of previous activity to populate suggestions
				this.props.fetchSuggestions(prev.lat, prev.long, CATEGORIES[this.state.category])
			} else {
				const next = cards[index + 1]
				lat = next.lat
				long = next.long
				// use location of next activity to populate suggestions
				this.props.fetchSuggestions(next.lat, next.long, CATEGORIES[this.state.category])
			}
		}

		if (!_.isNull(this.state.selected) && (new Date(freeTime.start_time)).getTime() === (new Date(this.state.selected.start_time)).getTime()) {
			this.setState({
				selected: null,
				pinLat: null,
				pinLong: null
			})
		} else {
			this.setState({
				selected: freeTime,
				pinLat: lat,
				pinLong: long
			})
		}
	}

	addCard(card) {
		const cards = this.formatCards()

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

	formatCards() {
		let cardList = []
		let startCard
		let prevEnd
		let startOfDay
		let cityLat
		let cityLong
		let cityStart
		let cityEnd

		_.each(this.props.cards, (card) => {
			if (card.type === 'city') {
				cityLat = card.lat
				cityLong = card.long
				cityStart = new Date(card.start_time)
				cityEnd = new Date(card.end_time)
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

		if (!_.isUndefined(startOfDay)) {
			const endOfDay = new Date(startOfDay.getTime() + (24 * 60 * 60 * 1000))
			if (prevEnd.getTime() < endOfDay.getTime()) {
				const freeTime = {
					type: 'free',
					start_time: prevEnd.toString(),
					end_time: endOfDay.toString()
				}

				cardList.push(freeTime)
			}
		}

		if (cardList.length === 0 && !_.isNil(cityStart) && !_.isNil(cityEnd)) {
			cityStart.setHours(0, 0, 0, 0)
			cityEnd.setHours(0, 0, 0, 0)

			cardList.push({
				type: 'day', 
				lat: cityLat,
				long: cityLong,
				start_time: cityStart.toString(),
				end_time: cityEnd.toString()
			})
		}

		return cardList
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return
		} else if (result.destination.droppableId !== result.source.droppableId) {
			if (result.destination.droppableId === 'suggestions-droppable') {
				// handle removing an item from the itinerary

			} else {
				// handle adding an item to the itinerary by dragging

			}
		} else if (result.destination.droppableId === 'suggestions-droppable') {
			// reorder suggestions

		} else {
			// handle reordering items in the itinerary

			const itinerary = Array.from(this.props.cards)

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

			itinerary.splice(result.destination.index, 0, item)

			let endIndex

			// indices show range of cards that need to update their times
			if (result.destination.index > result.source.index) {
				endIndex = itinerary.length
			} else {
				endIndex = result.source.index
			}

			for (let i = result.destination.index + 1; i < endIndex; i++) {
				const card = itinerary[i]

				// shift each card back by the duration of the card removed
				_.assign(card, {
					'start_time': new Date((new Date(card.start_time)).getTime() + duration),
					'end_time': new Date((new Date(card.end_time)).getTime() + duration)
				})
			}
		
			const path = window.location.pathname.split(':')
			const tripId = _.last(path)
			this.props.updateCards(itinerary, tripId, this.state.day)
			console.log(itinerary)

			// TODO
		}
	}

	render() {
		const cards = this.formatCards()
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
					<div className='planner'>
						<Suggestions
							addCard={this.addCard}
							suggestions={this.props.suggestions}
							category={this.state.category}
							selectCategory={this.selectCategory}
						/>

						<Itinerary
							tripId={tripId}
							cards={cards}
							day={this.state.day}
							selectTime={this.selectTime}
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
							MarkerPosition={{ lat: this.state.pinLat || 43.704441, lng: this.state.pinLong || -72.288694 }}
							MarkerClusterArray={this.props.suggestions}
							center={{ lat: this.state.pinLat || 43.704441, lng: this.state.pinLong || -72.288694 }}
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
		fetchSuggestions: (lat=43, long=-72, categories=null) => {
			dispatch(fetchSuggestions(lat, long, categories))
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace))
