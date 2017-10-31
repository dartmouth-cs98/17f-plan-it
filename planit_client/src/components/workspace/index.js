import React, { Component } from 'react'
import _ from 'lodash'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import NavBar from '../nav_bar/index.js'
import Map from '../map/index.js'
require('./index.scss')

const ITINERARY = [
	{
		date: 'November 14',
		cards: [
			{
				id: 851093,
				type: 'Attraction',
				name: 'Thai Taiwanese Embassy',
				description: 'Two become one',
				startDatetime: 'October 28, 2017 9:45:00',
				endDatetime: 'October 28, 2017 10:30:00',
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
		cards: [
			{
				id: 851093,
				type: 'Attraction',
				name: 'Thai Taiwanese Embassy',
				description: 'Two become one',
				startDatetime: 'October 28, 2017 9:45:00',
				endDatetime: 'October 28, 2017 10:30:00',
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

export default class Workspace extends Component {
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

	addCard(card) {
		if (!_.isNull(this.state.selected)) {
			const prevTravel = _.find(this.state.itinerary.cards, (card) => {
				return card.id === this.state.selected.next
			})

			// console.log(prevTravel)

			const prevEnd = new Date(this.state.selected.endDatetime)
			const startDate = new Date(prevEnd.getTime() + 15*60000)
			const endDate = new Date(startDate.getTime() + 60*60000)

			const afterTravel = {
				id: 103840,
				type: 'Travel',
				next: prevTravel.next
			}

			const newCard = {
				id: card.id,
				name: card.name,
				type: 'Attraction',
				description: card.description,
				next: afterTravel, 
				startDatetime: startDate.toString(),
				endDatetime: endDate.toString()
			}

			const beforeTravel = _.assign(prevTravel, {	next: card.id })

			let newCards = _.filter(this.state.itinerary.cards, (card) => {
				return card.id !== prevTravel.id
			})

			// console.log(newItinerary)

			newCards = newCards.concat([beforeTravel, newCard, afterTravel])

			console.log(newCards)
			this.setState({
				itinerary: _.assign(this.state.itinerary, {
					cards: newCards
				})
			})
		}
	}

	selectCard(card) {
		this.setState({ selected: card })
	}

	removeCard(id) {
		this.setState({
			itinerary: {
				date: this.state.itinerary.date,
				cards: _.filter(this.state.itinerary.cards, (card) => { 
					return card.id !== id
				})
			}
		})

		// api call to remove card from itinerary
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
