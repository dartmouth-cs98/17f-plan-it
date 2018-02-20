import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { fetchTrip, fetchCards, fetchDay, insertCard, updateCard, updateCards, updateCardsLive, deleteCardLive, deleteCard, fetchSuggestions, 
	clearSuggestions, createQueueCard } from '../../actions/index.js'
import { mainChannel } from '../../channels'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import NavBar from '../nav_bar/index.js'
import Map from '../map/index.js'
import DownloadTrip from '../download_trip/index.js'
import OnboardingInput from '../onboarding_input'
import Modal from 'react-modal'
import { getLatLng } from 'react-places-autocomplete'

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
		'parks',
		'queue'
]

class Workspace extends Component {
		constructor(props) {
				super(props)

				this.state = {
					day: DAY_NUMBER,
					category: 0,
					pinLat: null,
					pinLong: null,
					cityLat: null,
					cityLong: null,
					modal_open: false,
					custom_card_name: '',
					custom_card_address: '',
					custom_card_img_url: '',
					custom_card: {},
					name_error: '',
					address_error: '',
					image_url_error: ''
				}

				this.dayForward = this.dayForward.bind(this)
				this.dayBackward = this.dayBackward.bind(this)
				this.selectCategory = this.selectCategory.bind(this)
				this.searchSuggestions = this.searchSuggestions.bind(this)
				this.formatCards = this.formatCards.bind(this)
				this.formatSuggestions = this.formatSuggestions.bind(this)
				this.onDragEnd = this.onDragEnd.bind(this)
				this.updateStartTime = this.updateStartTime.bind(this)
				this.updateDuration = this.updateDuration.bind(this)
				this.sendLiveUpdate = this.sendLiveUpdate.bind(this)
				this.sendUpdates = this.sendUpdates.bind(this)
				this.sendDelete = this.sendDelete.bind(this)
				this.componentWillReceiveChannelUpdates = this.componentWillReceiveChannelUpdates.bind(this)

				// custom card functions
				this.onModalOpen = this.onModalOpen.bind(this)
				this.onModalClose = this.onModalClose.bind(this)
				this.onNameChange = this.onNameChange.bind(this)
				this.onOtherNameChange = this.onOtherNameChange.bind(this)
				this.onImageChange = this.onImageChange.bind(this)
				this.onHandleSelect = this.onHandleSelect.bind(this)
				this.onCustomCreate = this.onCustomCreate.bind(this)
				this.onResetCustomValues = this.onResetCustomValues.bind(this)
		}

	componentDidMount() {
		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

		this.setState({ tripId })
		this.props.clearSuggestions()
		this.props.fetchTrip(tripId)
		this.props.fetchDay(tripId, DAY_NUMBER)

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

	/****** custom card functions *******/
	onModalOpen() {
		this.setState({ modal_open: true })
	}

	onModalClose() {
		this.setState({ modal_open: false })
		this.onResetCustomValues()
	}

	onNameChange(event) {
		this.setState({ custom_card_name: event.target.value })
	}

	onHandleSelect(index, type, results, name) {
		const path = window.location.pathname.split(':')
		const trip_id = _.last(path)

		getLatLng(results).then(({ lat, lng }) => {
			let address = results.formatted_address

			let custom_card = {
				type,
				address,
				lat,
				long: lng,
				day_number: this.state.day,
				place_id: results.place_id,
				trip_id,
				travel_duration: 900
			}
			this.setState({ custom_card, custom_card_address: name })
		})
	}

	onOtherNameChange(index, type, name) {
		this.setState({ custom_card_address: name})
	}

	onImageChange(event) {
		this.setState({ custom_card_img_url: event.target.value })
	}

	onCustomCreate() {
		let custom_card = Object.assign({}, this.state.custom_card)
		custom_card.name = this.state.custom_card_name
		custom_card.photo_url = this.state.custom_card_img_url
		custom_card.start_time = new Date()
		custom_card.end_time = new Date()

		let name_error = custom_card.name? '' : 'Please name your card'
		let image_url_error = custom_card.photo_url? '' : 'Please enter an image url'
		let address_error = custom_card.lat && custom_card.long? '' : 'Please choose an address from the drop down'

		this.setState({ name_error, image_url_error, address_error })

		if (custom_card.name && custom_card.photo_url && custom_card.lat && custom_card.long) {
			this.props.createQueueCard(custom_card)

			const path = window.location.pathname.split(':')
			const tripId = _.last(path)
			const { pinLat, pinLong } = this.state
			if (!_.isNull(pinLat) && !_.isNull(pinLong)) {
				this.props.fetchSuggestions(pinLat, pinLong, tripId, 'queue')
			}

			this.onResetCustomValues()
		}
	}

	onResetCustomValues() {
		this.setState({
			custom_card_address: '',
			custom_card_name: '',
			custom_card_img_url: '',
			custom_card: {},
			modal_open: false
		})
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
			})
			const path = window.location.pathname.split(':')
			const tripId = _.last(path)
			this.props.fetchDay(tripId, newDay)
			// this.props.clearSuggestions()
		}
	}

	dayBackward() {
		if (this.state.day > 1) {
			const newDay = this.state.day - 1
			this.setState({
				day: newDay,
				category: 0,
			})
			const path = window.location.pathname.split(':')
			const tripId = _.last(path)
			this.props.fetchDay(tripId, newDay)
			// this.props.clearSuggestions()
		}
	}

	selectCategory(event, val) {
		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

		if (0 <= val < CATEGORIES.length) {
			this.setState({ category: val })
			const { pinLat, pinLong } = this.state
			if (!_.isNull(pinLat) && !_.isNull(pinLong)) {
				this.props.fetchSuggestions(pinLat, pinLong, tripId, CATEGORIES[val])
			}
		}
	}

	searchSuggestions(card) {
		const path = window.location.pathname.split(':')
		const tripId = _.last(path)
		this.props.fetchSuggestions(card.lat, card.long, tripId, CATEGORIES[this.state.category])
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
				cityStart = new Date(cityStart.getTime() + cityStart.getTimezoneOffset()*60*1000)
				cityEnd = new Date(card.end_time)
				cityEnd = new Date(cityEnd.getTime() + cityEnd.getTimezoneOffset()*60*1000)
				cardList.push(card)
				// set the base location
				return
			}

			let cardStart = new Date(card.start_time)
			cardStart = new Date(cardStart + cardStart.getTimezoneOffset()*60*1000)

			cardList.push(card)

			prevEnd = new Date(card.end_time)
			prevEnd = new Date(prevEnd + prevEnd.getTimezoneOffset()*60*1000)
		})

		// recenter map if the city card has changed
		if (cityLat !== this.state.cityLat || cityLong !== this.state.cityLong) {
			this.setState({
				pinLat: cityLat,
				pinLong: cityLong,
				cityLat,
				cityLong
			})
		}

		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

		// If there are no cards in the day, search for suggestions based on the city
		if (_.isNil(this.props.suggestions) || this.props.suggestions.length === 0 || _.isNull(this.state.pinLat) || _.isNull(this.state.pinLong)) {
			this.props.fetchSuggestions(cityLat, cityLong, tripId, CATEGORIES[this.state.category])
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
				const itinerary = _.map(Array.from(this.props.cards), _.clone)
				const [city] = _.remove(itinerary, (card) => {
					return card.type === 'city'
				})
				const suggestions = Array.from(this.formatSuggestions())
				const [item] = suggestions.splice(result.source.index, 1)

				// get the end time of the previous card to be the start time of the new card
				let start
				if (itinerary.length === 0 || result.destination.index === 0) {
					start = new Date(city.start_time)
				} else {
					start = new Date(itinerary[result.destination.index - 1].end_time)	
				}
				
				// replace start time
				const path = window.location.pathname.split(':')
				const tripId = _.last(path)

				const end = new Date(start.getTime() + start.getTimezoneOffset()*60*1000 + DEFAULT_DURATION)
				const city_starttime = new Date(city.start_time)
				let dayEnd  = new Date(city_starttime.getTime() + city_starttime.getTimezoneOffset()*60*1000)
				dayEnd.setHours(24, 0, 0, 0)

				if (end.getTime() > dayEnd.getTime()) {
					// if the new card would be in the next day, don't update
					return
				}

				const inserted = {
						...item,
						id: 0,
						travel_duration: TRAVEL_TIME,
						start_time: start,
						end_time: new Date(end.getTime() - end.getTimezoneOffset()*60*1000),
						trip_id: tripId,
						day_number: this.state.day
				}

				// add the new card to the itinerary
				itinerary.splice(result.destination.index, 0, inserted)

				// shift each card back by the duration of the card removed
				for (let i = result.destination.index + 1; i < itinerary.length; i++) {

					// stop updating following cards if there is no conflict
					let nextStartTime = new Date(itinerary[i].start_time)
					nextStartTime = new Date(nextStartTime.getTime())
					let prevEndTime = new Date(itinerary[i - 1].end_time)

					if (prevEndTime.getTime() <= nextStartTime.getTime()){
						break
					}

					const card = itinerary[i]

					// adjust for date conversion in order to compare
					let endTime = new Date(card.end_time)
					endTime = new Date(endTime.getTime() + endTime.getTimezoneOffset()*60*1000 + DEFAULT_DURATION)
					let dayEnd  = new Date(start.getTime() + start.getTimezoneOffset()*60*1000)
					dayEnd.setHours(24, 0, 0, 0)

					// make sure no cards would be pushed into the next day
					if (endTime.getTime() > dayEnd.getTime()) {
						return
					}

					// adjust times so that correct times are inserted into database
					let startTime = new Date(card.start_time)
					startTime = new Date(startTime.getTime() + DEFAULT_DURATION)
					endTime = new Date(endTime.getTime() - endTime.getTimezoneOffset()*60*1000)

					_.assign(card, {
						'start_time': startTime,
						'end_time': endTime
					})

				}

				// add the city card back
				itinerary.splice(0, 0, city)

				this.sendUpdates(itinerary, tripId)
			}
		} else if (result.destination.droppableId === 'suggestions-droppable') {
			// reorder suggestions

		} else if (result.destination.droppableId === 'itinerary-droppable') {
			// reorder items in the itinerary

			const itinerary = _.map(Array.from(this.props.cards), _.clone)
			const [city] = _.remove(itinerary, (card) => {
				return card.type === 'city'
			})

			// get the start time of the item you're trying to replace
			let start = result.destination.index > result.source.index ?
				new Date(itinerary[result.destination.index].end_time) : new Date(itinerary[result.destination.index].start_time)

			const dayEnd = new Date(city.start_time)
			dayEnd.setHours(24, 0, 0, 0)

			// get the info of the object you're dragging
			const [removed] = itinerary.splice(result.source.index, 1)
			const duration = (new Date(removed.end_time)).getTime() - (new Date(removed.start_time)).getTime()
			const end = new Date(start.getTime() + duration)

			if (end.getTime() > dayEnd.getTime()) {
				// if card is dragged into the next day, don't update
				return
			}

			// update the start and end times of the item being dragged
			const item = _.assignIn({}, removed, {
				'start_time': start,
				'end_time': end
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

			// shift each card back by the duration of the card removed
			for (let i = result.destination.index + 1; i < endIndex; i++) {
				const card = itinerary[i]

				let endTime = new Date(card.end_time)
				endTime = new Date(endTime.getTime() + endTime.getTimezoneOffset()*60*1000 + duration)

				const dayEnd = new Date(start.getTime() + start.getTimezoneOffset()*60*1000)
				dayEnd.setHours(24, 0, 0, 0)

				// make sure no cards would be pushed into the next day
				if (endTime.getTime() > dayEnd.getTime()) {
					return
				}

				let startTime = new Date(card.start_time)
				startTime = new Date(startTime.getTime() + duration)
				endTime = new Date(endTime.getTime() - endTime.getTimezoneOffset()*60*1000)

				_.assign(card, {
					'start_time': startTime,
					'end_time': endTime
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

		// reorder items in the itinerary
		const [city] = _.remove(itinerary, (card) => {
				return card.type === 'city'
			})

		const index = _.findIndex(itinerary, (card) => {
			return card.id === cardId
		})

		// get a value representing the end of the day
		let dayEnd  = new Date(itinerary[index].start_time)
		dayEnd = new Date(dayEnd.getTime() + dayEnd.getTimezoneOffset()*60*1000)
		dayEnd.setHours(24, 0, 0, 0)

		// adjust start time for date conversion
		let start_date = new Date(itinerary[index].start_time)
		start_date = new Date(start_date.getTime() + start_date.getTimezoneOffset()*60*1000)

		// calculate the change in time to update
		const diff = (start_date.getTime() - time.getTime())

		if (diff < 0) {

			// increase the start time of the card and all cards after it
			for (let i = index; i < itinerary.length; i++) {

				const card = itinerary[i]

				let endTime = new Date(card.end_time)
				endTime = new Date(endTime.getTime() + endTime.getTimezoneOffset()*60*1000 - diff)

				if (endTime.getTime() > dayEnd.getTime()) {
					// if the later cards would get pushed back to the next day, don't edit the start time
					return
				}

				// get start_time of card 
				let startTime = new Date(card.start_time)
				startTime = new Date(startTime.getTime() - diff)
				endTime = new Date(endTime.getTime() - endTime.getTimezoneOffset()*60*1000)

				_.assign(card, {
					'start_time': startTime,
					'end_time': endTime
				})

				// stop updating following cards if there is no conflict
				if (i < itinerary.length - 1){
					let nextStartTime = new Date(itinerary[i + 1].start_time)
					nextStartTime = new Date(nextStartTime.getTime())

					if (endTime.getTime() <= nextStartTime.getTime()){
						break
					}

				}
			}
		} else if (diff > 0) {

			// shift card backwards in time if possible

			// get new start time of card
			let startTime = new Date(itinerary[index].start_time)
			startTime = new Date(startTime.getTime() - diff)

			if (index > 0 && itinerary[index - 1].type !== 'city') {

				// get end time of the card in front of it
				let prevEndTime = new Date(itinerary[index - 1].end_time)

				if (startTime.getTime() >= prevEndTime.getTime()) {
					let endTime = new Date(itinerary[index].end_time)
					endTime = new Date(endTime.getTime() - diff)

					_.assign(itinerary[index], {
						'start_time': startTime,
						'end_time': endTime
					})

				}

			} else if (index === 0 || itinerary[index - 1].type === 'city') {
				// check if it goes before midnight
				let dayStart = new Date(itinerary[index].start_time)
				dayStart = new Date(dayStart.getTime() + dayStart.getTimezoneOffset()*60*1000)
				dayStart.setHours(0, 0, 0, 0)

				let endTime = new Date(itinerary[index].end_time)
				endTime = new Date(endTime.getTime() - diff)

				if (new Date(startTime.getTime() + startTime.getTimezoneOffset()*60*1000) >= dayStart.getTime()) {

					startTime = 
					_.assign(itinerary[index], {
						'start_time': startTime,
						'end_time': endTime
					})
				}
			}
		}

		// add the city card back
		itinerary.splice(0, 0, city)

		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

		this.sendUpdates(itinerary, tripId)
	}

	updateDuration(cardId, duration) {

		if (duration < (1000 * 60 * 60)) {
			return
		}

		const itinerary = _.map(Array.from(this.props.cards), _.clone)

		const [city] = _.remove(itinerary, (card) => {
			return card.type === 'city'
		})

		const index = _.findIndex(itinerary, (card) => {
			return card.id === cardId
		})

		// get a value representing the end of the day
		let dayEnd  = new Date(itinerary[index].start_time)
		dayEnd = new Date(dayEnd.getTime() + dayEnd.getTimezoneOffset()*60*1000)
		dayEnd.setHours(24, 0, 0, 0)


		const card = itinerary[index]
		const endTime = new Date((new Date(card.start_time)).getTime() + duration + dayEnd.getTimezoneOffset()*60*1000)

		if (endTime.getTime() > dayEnd.getTime()) {
			// if the card would overlap into the next day, prevent updating
			return
		}

		_.assign(card, { 'end_time': new Date(endTime.getTime() - endTime.getTimezoneOffset()*60*1000)})

		let diff

		for (let i = index + 1; i < itinerary.length; i++) {
			diff = (new Date(itinerary[i].start_time)).getTime() - (new Date(itinerary[i - 1].end_time)).getTime()
			if (diff < 0) {
				let endTime = new Date(itinerary[i].end_time)
				endTime = new Date(endTime.getTime() + endTime.getTimezoneOffset()*60*1000 - diff)
				if (endTime.getTime() > dayEnd.getTime()) {
					// if it would push a card to the next day, don't update
					return
				} else {
					_.assign(itinerary[i], {
						'start_time': new Date((new Date(itinerary[i].start_time)).getTime() - diff),
						'end_time': new Date(endTime.getTime() - endTime.getTimezoneOffset()*60*1000)
					})
				}
			} else {
				break
			}
		}

		const path = window.location.pathname.split(':')
		const tripId = _.last(path)

		// add the city card back in
		itinerary.splice(0, 0, city)

		this.sendUpdates(itinerary, tripId)
	}

	render() {
		const cards = this.formatCards(this.state.cards)
		const [city] = _.filter(cards, (card) => { return card.type === 'city'})

		const suggestions = this.props.suggestions
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
				<Modal
					isOpen={this.state.modal_open}
					onRequestClose={this.onModalClose}
					className='card horizontal center no_outline'>
					<div className="card-content date_modal">
						<p>Card Name</p>
						<OnboardingInput placeholder={'Name your card'}
							onNameChange={this.onNameChange}
							name={this.state.custom_card_name}
						/>
						<div className='custom_error'>{this.state.name_error}</div>
						<p>Card Image</p>
						<OnboardingInput placeholder={'Enter trip image URL'}
							onImageChange={this.onImageChange}
							name={this.state.custom_card_image_url}
						/>
						<div className='custom_error'>{this.state.image_url_error}</div>
						<p>Card Address</p>
						<OnboardingInput placeholder={'Enter address or attraction name'}
							index={0}
							name={this.state.custom_card_address}
							input_type='custom'
							onOtherNameChange={this.onOtherNameChange}
							onHandleSelect={this.onHandleSelect}
						/>
						<div className='custom_error'>{this.state.address_error}</div>
						<div className='button_container start-onboarding-button'
							onClick={this.onCustomCreate}>
							Add Card
						</div>
					</div>
				</Modal>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<div className='planner'>
						<Suggestions
							suggestions={suggestions}
							category={this.state.category}
							selectCategory={this.selectCategory}
							onModalOpen={this.onModalOpen}
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
							updateDuration={this.updateDuration}
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
		fetchDay: (id, day) => {
			dispatch(fetchDay(id, day))
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
		fetchSuggestions: (lat, long, tripId, categories=null) => {
			dispatch(fetchSuggestions(lat, long, tripId, categories))
		},
		clearSuggestions: () => {
			dispatch(clearSuggestions())
		},
		createQueueCard: (card) => {
			dispatch(createQueueCard(card))
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace))
