import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import Toolbar from '../tool_bar/index.js'
import Itinerary from '../itinerary/index.js'
import { DragDropContext } from 'react-beautiful-dnd'
import NavBar from '../nav_bar/index.js'
import Map from '../map/index.js'
import DownloadTrip from '../download_trip/index.js'
import { fetchTrip, fetchCards } from '../../actions/index.js'
require('./index.scss')

const DEFAULT_DURATION = 3600000
const DAY_NUMBER = 1
const TRAVEL_TIME = 900000

class ReadOnly extends Component {
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
		this.formatCards = this.formatCards.bind(this)
	}

	componentDidMount() {
		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

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

		return cardList
	}

	render() {
		const cards = this.formatCards()
		const [city] = _.filter(cards, (card) => {
			return card.type === 'city'
		})

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
				/>
					<DownloadTrip tripId={tripId}/>
					<DragDropContext>
					<div className='planner'>
						<Itinerary
							tripId={tripId}
							cards={cards}
							day={this.state.day}
							selected={this.state.selected}
							dayForward={this.dayForward}
							dayBackward={this.dayBackward}
							numDays={tripDuration}
							readOnly={true}
						/>
						<Map
							isInfoOpen={false}
							isMarkerShown={true}
							MarkerPosition={{ lat: this.state.pinLat || city ? city.lat : null, lng: this.state.pinLong || city ? city.long : null }}
							center={{ lat: this.state.pinLat || city ? city.lat : null, lng: this.state.pinLong || city ? city.long : null }}
							infoMessage="Hello From Dartmouth"
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
		cards: state.cards.all
	}
}

export default withRouter(connect(mapStateToProps, { fetchTrip, fetchCards })(ReadOnly))
