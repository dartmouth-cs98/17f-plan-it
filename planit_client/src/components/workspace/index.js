import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import NavBar from '../nav_bar/index.js'
import Map from '../map/index.js'
import { fetchTrip, fetchCards } from '../../actions/index.js';
require('./index.scss')

const DEFAULT_START = '9:00:00'
const DEFAULT_END = '10:00:00'
const TRIP_ID = 1
const ITINERARY = [
	{
		date: 'November 14',
		startCard: 851093,
		cards: [
			{
				id: 851093,
				type: 'Attraction',
				name: 'Thai Taiwanese Embassy',
				description: 'Two become one',
				startDatetime: 'November 14, 2017 9:45:00',
				endDatetime: 'November 14, 2017 10:30:00',
				next: 193048
			},
			{
				id: 193048,
				type: 'Travel', 
				next: 148290
			},
			{
				id: 148290,
				type: 'Attraction',
				name: 'Thai the Knot',
				description: 'The perfect venue for weddings of all different kinds',
				startDatetime: 'November 14, 2017 10:45:00',
				endDatetime: 'November 14, 2017 11:45:00'
			}
		]
	},
	{
		date: 'November 15',
		startCard: 851093,
		cards: [
			{
				id: 851093,
				type: 'Attraction',
				name: 'Thai Taiwanese Embassy',
				description: 'Two become one',
				startDatetime: 'November 14, 2017 9:45:00',
				endDatetime: 'November 14, 2017 10:30:00',
				next: 193048
			},
			{
				id: 193048,
				type: 'Travel', 
				next: 148290
			},
			{
				id: 148290,
				type: 'Attraction',
				name: 'Thai the Knot',
				description: 'The perfect venue for weddings of all different kinds',
				startDatetime: 'November 14, 2017 10:45:00',
				endDatetime: 'November 14, 2017 11:45:00'
			}
		]
	}
]

class Workspace extends Component {
	constructor(props) {
		super(props)

		this.state = {
			day: 1,
			itinerary: ITINERARY[0],
			selected: null
		}

		this.addCard = this.addCard.bind(this)
		this.selectCard = this.selectCard.bind(this)
		this.removeCard = this.removeCard.bind(this)
		this.dayForward = this.dayForward.bind(this)
		this.dayBackward = this.dayBackward.bind(this)
	}

	componentDidMount() {
		this.props.fetchTrip(TRIP_ID)
		this.props.fetchCards(TRIP_ID, 1)
	}

	addCard(card) {
		if (this.state.itinerary.cards.length === 0) {
			let newCard = {
				id: card.id,
				name: card.name,
				type: 'Attraction',
				description: card.description,
				startDatetime: `${this.state.itinerary.date}, ${DEFAULT_START}`,
				endDatetime: `${this.state.itinerary.date}, ${DEFAULT_END}`
			}

			this.setState({
				itinerary: _.assign(this.state.itinerary, {
					cards: [newCard],
					startCard: newCard.id
				})
			})
		} else if (!_.isNull(this.state.selected) && _.isUndefined(_.find(this.state.itinerary.cards, (item) => {
			return card.id === item.id
		}))) {
			const prevTravel = _.find(this.state.itinerary.cards, (card) => {
				return card.id === this.state.selected.next
			}) || {
				id: card.id - 1,
				type: 'Travel'
			}

			const prevEnd = new Date(this.state.selected.endDatetime)
			const startDate = new Date(prevEnd.getTime() + 15*60000)
			const endDate = new Date(startDate.getTime() + 60*60000)

			let toAdd = []

			let newCard = {
				id: card.id,
				name: card.name,
				type: 'Attraction',
				description: card.description,
				startDatetime: startDate.toString(),
				endDatetime: endDate.toString()
			}

			if (!_.isUndefined(this.state.selected.next)) {
				toAdd.push({
					id: card.id + 1,
					type: 'Travel',
					next: prevTravel.next
				})

				_.assign(newCard, { next: card.id + 1 })
			}

			toAdd.push(_.assign(this.state.selected, { next: prevTravel.id }))
			toAdd.push(_.assign(prevTravel, {	next: card.id }))
			toAdd.push(newCard)

			let newCards = _.filter(this.state.itinerary.cards, (card) => {
				return card.id !== prevTravel.id && card.id !== this.state.selected.id
			})

			newCards = newCards.concat(toAdd)

			this.setState({
				itinerary: _.assign(this.state.itinerary, {
					cards: newCards
				}), 
				selected: null
			})
		}
	}

	selectCard(card) {
		this.setState({ selected: card })
	}

	removeCard(card) {
		let prevTravel = _.find(this.state.itinerary.cards, (item) => {
			return item.next === card.id
		})

		const nextTravel = _.find(this.state.itinerary.cards, (item) => {
			return card.next === item.id
		})

		let toDelete = [card.id]
		let prevCard
		let startCard

		if (!_.isUndefined(prevTravel)) {
			prevCard = _.find(this.state.itinerary.cards, (item) => {
				return item.next === prevTravel.id
			})

			toDelete.push(prevCard.id)

			if (!_.isUndefined(nextTravel)) {
				_.assign(prevTravel, { next: nextTravel.next })
			}

			toDelete.push(prevTravel.id)
		} else {
			if (!_.isUndefined(nextTravel)) {
				startCard = nextTravel.next
			}
		}

		if (!_.isUndefined(nextTravel)) {
			console.log(nextTravel)
			toDelete.push(nextTravel.id)
		} else {
			prevTravel = null

			if (!_.isUndefined(prevCard)) {
				_.assign(prevCard, { next: null })
			}
		}

		let newCards = _.filter(this.state.itinerary.cards, (item) => {
			return _.indexOf(toDelete, item.id) < 0
		})

		if (!_.isNil(prevTravel)) {
			newCards.push(prevTravel)
		}

		if (!_.isUndefined(prevCard)) {
			newCards.push(prevCard)
		}

		console.log(newCards)

		this.setState({
			itinerary: _.assign(this.state.itinerary, {
				startCard: startCard || this.state.itinerary.startCard,
				cards: newCards
			}), 
			selected: null
		})
		// TODO: hook up api call to remove card from itinerary
	}

	dayForward() {
		const day = Math.min(this.state.day + 1, ITINERARY.length)
		this.setState({ 
			day,
			itinerary: ITINERARY[day - 1]
		})
	}

	dayBackward() {
		const day = Math.max(this.state.day - 1, 1)

		this.setState({ 
			day,
			itinerary: ITINERARY[day - 1]
		})
	}

	render() {
		return (
			<div id='workspace'>
				<NavBar background={'globe_background'}/>
				<Toolbar />
				<div className='planner'>
					<Suggestions addCard={this.addCard}	/>
					<Itinerary 
						itinerary={this.state.itinerary}
						cards={this.props.cards}
						day={this.state.day}
						selectCard={this.selectCard}
						removeCard={this.removeCard}
						dayForward={this.dayForward}
						dayBackward={this.dayBackward}
						backArrow={this.state.day > 1}
						forwardArrow={this.state.day < ITINERARY.length}
					/>
					<Map isInfoOpen={false} isMarkerShown={true} MarkerPosition={{ lat: 43.704441, lng: -72.288694 }} center={{ lat: 43.704441, lng: -72.288694 }} infoMessage="Hello From Dartmouth"/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		trip: state.trip, 
		trips: state.trips,
		cards: state.cards.all
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchTrip: (id) => {
			dispatch(fetchTrip(id))
		}, 
		fetchCards: (id, day) => {
			dispatch(fetchCards(id, day))
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace))
