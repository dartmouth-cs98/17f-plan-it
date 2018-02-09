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
import { fetchTrip, fetchCards, createTrip, createCard, fetchAllCards } from '../../actions/index.js'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import OnboardingInput from '../onboarding_input'
import { SingleDatePicker } from 'react-dates'
import cookie from 'react-cookies'
import Modal from 'react-modal'

import '../../react_dates_overrides.css'
require('./index.scss')

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
			cards: [],
			modal_open: false,
			focused: false,
			trip_name: '',
			image_url: 'https://s4.favim.com/orig/50/art-beautiful-cool-earth-globe-Favim.com-450335.jpg',
			start_date: null
		}

		this.dayForward = this.dayForward.bind(this)
		this.dayBackward = this.dayBackward.bind(this)
		this.formatCards = this.formatCards.bind(this)
		this.onModalOpen = this.onModalOpen.bind(this)
		this.onModalClose = this.onModalClose.bind(this)
		this.onImportTrip = this.onImportTrip.bind(this)
		this.onNameChange = this.onNameChange.bind(this)
		this.onImageChange = this.onImageChange.bind(this)
	}

	getDayOffset(second_date, first_date) {
		const MILLISECONDS = 1000*60*60*24
		return Math.round(second_date - first_date)/MILLISECONDS
	}

	addDays(dat, days_to_add) {
		dat.setDate(dat.getDate() + days_to_add)
		return dat
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.trip_id) {
			let cards = []
			let offset = this.getDayOffset(new Date(this.state.start_date).getTime(), new Date(this.props.trips[0].start_time).getTime())

			_.forEach(this.props.all_cards, (card) => {
  				let start_date = this.addDays(new Date(card.start_time), offset)
  				let end_date = this.addDays(new Date(card.end_time), offset)

				const updated_card = _.assign(card, {
					trip_id: nextProps.trip_id,
					start_time: start_date,
					end_time: end_date
				})

				cards.push(updated_card)
			})
			this.props.createCard(cards)
			this.props.history.push(`/workspace/:${nextProps.trip_id}`)
		}
	}

	componentDidMount() {
		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

		this.props.fetchTrip(tripId)
		this.props.fetchCards(tripId, DAY_NUMBER)
		this.props.fetchAllCards(tripId)
	}

	onModalClose() {
		this.setState( { modal_open: false } )
	}

	onModalOpen() {
		this.setState( { modal_open: true } )
	}

	onNameChange(event) {
		if (event.target.value.length < 20) {
			this.setState({ trip_name: event.target.value })
		}
	}

	onImageChange(event) {
		this.setState({ image_url: event.target.value })
	}

	onImportTrip() {
		let trip_name = (_.isUndefined(this.state.trip_name) || this.state.trip_name === '')? 'My Trip' : this.state.trip_name
		let start_date = _.isUndefined(this.state.start_date)? new Date(this.state.start_date) : new Date()
		let end_date = this.props.trips[0].end_time? this.addDays(new Date(this.props.trips[0].end_time), 
			this.getDayOffset(start_date, new Date(this.props.trips[0].start_time))) : null

		this.props.createTrip({
			name: trip_name,
			user_id: cookie.load('auth'),
			start_time: start_date,
			end_time: end_date,
			photo_url: this.state.image_url
		})
	}

	dayForward() {
		const tripStart = this.props.trips[0] ? this.props.trips[0].start_time : null
		const tripEnd = this.props.trips[0] ? this.props.trips[0].end_time : null
		const tripDuration = (tripStart && tripEnd) ? this.getDayOffset(new Date(tripEnd).getTime(), new Date(tripStart).getTime()) : null

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

		_.each(this.props.cards, (card) => {
			if (card.type === 'city') {
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
				<Modal
				    isOpen={this.state.modal_open}
				    onRequestClose={this.onModalClose}
				    className='card horizontal center no_outline'>
					<div className="card-content date_modal">
						<p>Name your trip</p>
						<OnboardingInput placeholder={'Name your trip'}
							onNameChange={this.onNameChange}
							name={this.state.trip_name}
						/>
						<p>Give it a photo</p>
						<OnboardingInput placeholder={'Enter trip image URL'}
							onImageChange={this.onImageChange}
							name={this.state.image_url}
						/>
	        			<p>What's your start date?</p>
	        			<SingleDatePicker
							date={this.state.start_date}
							onDateChange={(start_date) => this.setState({ start_date })}
							focused={this.state.focused}
							onFocusChange={({ focused }) => this.setState({ focused })}
							withPortal={true}
							hideKeyboardShortcutsPanel={true}
						/>
						<div className='button_container start' onClick={this.onImportTrip}>Let's go</div>
	        		</div>
				</Modal>
				<Toolbar
					tripName={this.props.trips[0] ? this.props.trips[0].name : 'My Trip'}
					published={this.props.trips[0] ? this.props.trips[0].publish : false}
					tripId={tripId}
					readOnly={true}
					onModalOpen={this.onModalOpen}
				/>
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
		cards: state.cards.all,
		all_cards: state.cards.all_cards,
		trip_id: state.trips.trip_id
	}
}

export default withRouter(connect(mapStateToProps, { fetchTrip, fetchCards, createTrip, createCard, fetchAllCards })(ReadOnly))
