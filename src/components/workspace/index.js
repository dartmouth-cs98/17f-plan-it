import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import NavBar from '../nav_bar/index.js'
import Map from '../map/index.js'
import { fetchTrip, fetchCards, insertCard, updateCard, deleteCard, fetchSuggestions } from '../../actions/index.js';
require('./index.scss')

const DEFAULT_DURATION = 3600000
const TRIP_ID = 1
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

			if (_.isUndefined(startCard)) {
				startCard = card.id

				const startTime = new Date(card.start_time)
				startOfDay = new Date(`${startTime.getMonth() + 1}/${startTime.getDate()}/${startTime.getFullYear()}`)

				// add free time at end of the day
				if (startTime.getTime() > startOfDay.getTime()) {
					const freeTime = {
						type: 'free',
						start_time: startOfDay.toString(),
						end_time: startTime.toString()
					}

					cardList.push(freeTime)
				}
			} else {
				const cardStart = new Date(card.start_time)

				const travelStart = new Date(cardStart.getTime() - TRAVEL_TIME)
				const travel = {
					type: 'travel',
					start_time: travelStart.toString(),
					end_time: card.start_time,
					travelType: card.travelType,
					destination: card.name
				}

				// add the free time and travel before a card
				if (!_.isUndefined(prevEnd) && prevEnd.getTime() < travelStart.getTime()) {
					const freeTime = {
						type: 'free',
						start_time: prevEnd.toString(),
						end_time: travelStart.toString()
					}

					cardList.push(freeTime)
				}

				cardList.push(travel)
			}

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
		deleteCard: (id, trip, day) => {
			dispatch(deleteCard(id, trip, day))
		},
		fetchSuggestions: (lat=43, long=-72, categories=null) => {
			dispatch(fetchSuggestions(lat, long, categories))
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace))