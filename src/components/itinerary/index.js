import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import $ from 'jquery'
import _ from 'lodash'
import Dialog from 'material-ui/Dialog'
import TimePicker from 'material-ui/TimePicker'
import FlatButton from 'material-ui/FlatButton'
import { scaleLinear } from 'd3-scale'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Item from '../item/index.js'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import { getLatLng } from 'react-places-autocomplete'
import OnboardingInput from '../onboarding_input'
import { deleteCard, updateCard } from '../../actions/index.js'
import './index.scss'

const TIME_SCALE = 2500
const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]

const grid = 8
const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	margin: `0 0 ${grid}px 0`,

	// styles we need to apply on draggables
	...draggableStyle,
})
const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? 'lightblue' : '#e0e0e0',
	padding: grid,
	minHeight: '100%'
})

class Itinerary extends Component {
	constructor(props) {
		super(props)

		this.state = {
			startTimeDialog: false,
			editCard: null,
			shift: false,
			newTime: null,
			readOnly: this.props.readOnly,
			modal_open: false,
			city_name: '',
			city_address: '',
			lat: '',
			lng: '',
			place_id: '',
			error: ''
		}

		this.openStartTimeDialog = this.openStartTimeDialog.bind(this)
		this.closeDialog = this.closeDialog.bind(this)
		this.toggleShift = this.toggleShift.bind(this)
		this.selectTime = this.selectTime.bind(this)
		this.updateStartTime = this.updateStartTime.bind(this)
		this.onModalOpen = this.onModalOpen.bind(this)
		this.onModalClose = this.onModalClose.bind(this)
		this.onHandleSelect = this.onHandleSelect.bind(this)
		this.onOtherNameChange = this.onOtherNameChange.bind(this)
		this.onSave = this.onSave.bind(this)
	}

	onModalOpen() {
		this.setState({ modal_open: true })
	}

	onModalClose() {
		this.setState({
			modal_open: false,
			city_name: '',
			city_address: '',
			lat: '',
			lng: '',
			place_id: '',
			error: ''
		})
	}

	onOtherNameChange(index, type, name) {
		this.setState({ city_name: name})
	}

	onHandleSelect(index, type, results, name) {
		getLatLng(results).then(({ lat, lng }) => {

			let city_address = results.formatted_address
			let place_id = results.place_id

			this.setState({ city_address, place_id, lat, lng, city_name: name })
		})
	}

	onSave() {
		if (!this.state.place_id) {
			this.setState({ error: 'Please choose a city from the dropdown', place_id: '' })
		}
		else if (!_.isNil(this.props.cards) && this.props.cards.length > 0) {
			if (this.props.cards[0].type === 'city' && this.props.cards[0].name === this.state.city_name) {
				this.setState({ error: `Already in ${this.props.cards[0].name.split(',')[0]}`, place_id: ''})
			} else {
				_.map(this.props.cards, (card, index) => {
					if (card.type === 'city') {
						let city_card = _.assign(card, {
							name: this.state.city_name,
							address: this.state.city_name,
							place_id: this.state.place_id,
							lat: this.state.lat,
							long: this.state.lng
						})
						this.props.updateCard(card.id, city_card, this.props.tripId, this.props.day)
					} else {
						this.props.deleteCard(card.id, this.props.tripId, this.props.day)
					}
				})
				this.props.onCityUpdate(this.state.lat, this.state.lng)
				this.onModalClose()
			}
		}
	}

	openStartTimeDialog(card) {
		this.setState({
			startTimeDialog: true,
			editCard: card
		})
	}

	closeDialog() {
		this.setState({
			startTimeDialog: false,
			shift: false,
			editCard: null
		})
	}

	toggleShift() {
		this.setState({	shift: !this.state.shift })
	}

	selectTime(event, time) {
		this.setState({ newTime: time - new Date().getTimezoneOffset() })
	}

	updateStartTime() {
		if (_.isNull(this.state.editCard) || _.isNull(this.state.newTime)) {
			this.closeDialog()
			return
		}

		const index = _.findIndex(this.props.cards, (card) => {
			return card.id === this.state.editCard.id
		})

		const shift = this.state.newTime.getTime() - (new Date(this.state.editCard.start_time)).getTime()
		const duration = (new Date(this.state.editCard.end_time)).getTime() - (new Date(this.state.editCard.start_time)).getTime()

		// if (!this.state.shift) {
		if (shift > 0 && index < this.props.cards.length - 1) {
			const next = this.props.cards[index + 1]
			const newEndTime = this.state.newTime.getTime() + duration

			// don't update if it would mess up a boundary afterwards
			if (next.type !== 'free' || (new Date(next.end_time)).getTime() < newEndTime) {
				this.closeDialog()
				return
			}
		} else if (shift < 0 && index > 1) {
			const prev = this.props.cards[index - 1]

			// don't update if it would mess up a boundary before
			if (prev.type !== 'free' || (new Date(prev.start_time)).getTime() > this.state.newTime.getTime()) {
				this.closeDialog()
				return
			}
		}

		this.props.updateCard(this.state.editCard.id, {
			start_time: this.state.newTime,
			end_time: new Date(this.state.newTime.getTime() + duration)
		}, this.props.tripId, this.props.day)

		this.closeDialog()
	}

	renderBackButton() {
		if (this.props.day > 1) {
			return (
				<FlatButton
					className='left-button'
					onClick={this.props.dayBackward}
					icon={
						<i
							className='fa fa-caret-left'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
			)
		}
	}

	renderForwardButton() {
		if (this.props.day < this.props.numDays) {
			return (
				<FlatButton
					className='right-button'
					onClick={this.props.dayForward}
					icon={
						<i
							className='fa fa-caret-right'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
			)
		}
	}

	renderHeader() {
		let dayLabel = `Day ${this.props.day}`

		if (!_.isNil(this.props.cards) && this.props.cards.length > 0) {

			let date = new Date(this.props.cards[0].start_time)
			date = new Date(date.getTime() + date.getTimezoneOffset()*60*1000)
			dayLabel += `: ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
		}

		return (
			<div className='itinerary-header'>
				<div className= 'left-wrapper'>
					{this.renderBackButton()}
				</div>
				<label className='itinerary-title'>
					{dayLabel}
				</label>
				<div className = 'right-wrapper'>
					{this.renderForwardButton()}
				</div>
			</div>
		)
	}

	renderFooter() {
		let cityLabel = ''

		if (!_.isNil(this.props.cards) && this.props.cards.length > 0) {
			if (this.props.cards[0].type === 'city') cityLabel = this.props.cards[0].name.split(',')[0]
		}

		return (
			<div className='itinerary-footer'>
				<label className='city-title'>
					{cityLabel}
				</label>
				<i
					className='fa fa-pencil'
					style={{color: '#FFFFFF', margin: '10px', cursor: 'pointer', float: 'right'}}
					onClick={this.onModalOpen}
					data-tip
					data-for='cityTip'
				/>
				<ReactTooltip id='cityTip' effect='solid' offset={{ bottom: 5 }}>
					<span>Change the city for this day</span>
				</ReactTooltip>
			</div>
		)
	}

	renderModal() {
		return (
			<Modal
				isOpen={this.state.modal_open}
				onRequestClose={this.onModalClose}
				className='card horizontal center no_outline'>
				<div className="card-content date_modal">
					<p>{`Change city for day ${this.props.day}`}</p>
					<OnboardingInput placeholder={'Enter city'}
						index={0}
						name={this.state.city_name}
						input_type='city'
						onOtherNameChange={this.onOtherNameChange}
						onHandleSelect={this.onHandleSelect}
					/>
					<div className='custom_error'>{this.state.error}</div>
					<div className='button_container start-onboarding-button'
						onClick={this.onSave}>
						Save Change
					</div>
				</div>
			</Modal>
		)
	}

	renderList() {
		let index = 0
		const toRender = []

		for (const card of this.props.cards) {
			if (card.type === 'city') {
				continue
			} else if (this.state.readOnly) {

				let start = new Date(card.start_time)
				start = new Date(start.getTime() + start.getTimezoneOffset()*60*1000)

				toRender.push(
					<Item
						key={card.id}
						name={card.name}
						description={card.description}
						timeScale={TIME_SCALE}
						startTime={start}
						endTime={card.end_time}
						duration={(new Date(card.end_time)).getTime() - (new Date(card.start_time)).getTime()}
						buttons={false}
						photo_url={card.photo_url}
						url={card.url}
						type={card.type}
						address={card.address}
						city={card.city}
						state={card.state}
						country={card.country}
						rating={card.rating}
						price={card.price}
						source={card.source}
						travel_duration={card.travel_duration}
						travel_type={card.travel_type}
					/>
				)
			} else {

				let is_last_card = (index === this.props.cards.length-2)

				let start = new Date(card.start_time)
				start = new Date(start.getTime() + start.getTimezoneOffset()*60*1000)

				let end = new Date(card.end_time)
				end = new Date(end.getTime() + end.getTimezoneOffset()*60*1000)

				toRender.push(
					<Draggable key={card.id} draggableId={card.id} index={index++}>
						{(provided, snapshot) => (
							<div>
								<div
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									style={getItemStyle(
										snapshot.isDragging,
										provided.draggableProps.style,
									)}
								>
									<Item
										key={card.id}
										cardId={card.id}
										name={card.name}
										description={card.description}
										editCard={() => {
											this.openStartTimeDialog(card)
										}}
										search={() => {
											this.props.searchSuggestions(card)
										}}
										timeScale={TIME_SCALE}
										updateTime={this.props.updateTime}

										startTime={start}
										updateDuration={this.props.updateDuration}
										endTime={end}
										duration={(new Date(card.end_time)).getTime() - (new Date(card.start_time)).getTime()}
										remove={() => {
											this.props.removeCard(card.id, this.props.tripId, this.props.day)
										}}
										buttons={true}
										travel_duration={card.travel_duration}
										travel_type={card.travel_type}
										is_last_card={is_last_card}
									/>
								</div>
								{provided.placeholder}
							</div>
						)}
					</Draggable>
				)
			}
		}

		return toRender
	}

	render() {
		if (this.state.readOnly) {
			return (
				<div id='itinerary-box'>
					{this.renderHeader()}
					<div className='body-container'>
						<div className='itinerary-body'>
							<div className='itinerary-list'>
								{this.renderList()}
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div id='itinerary-box'>
					{this.renderModal()}
					{this.renderHeader()}
					<div className='body-container'>
						<div className='itinerary-body'>
							<div className='itinerary-list'>
								<Droppable droppableId='itinerary-droppable'>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											style={getListStyle(snapshot.isDraggingOver)}
										>
											{this.renderList()}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						</div>
					</div>
					{this.renderFooter()}
				</div>
			)
		}
	}
}

export default withRouter(connect(null, { deleteCard, updateCard })(Itinerary))
