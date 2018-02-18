import React, { Component } from 'react'
import $ from 'jquery'
import _ from 'lodash'
import Dialog from 'material-ui/Dialog'
import TimePicker from 'material-ui/TimePicker'
import FlatButton from 'material-ui/FlatButton'
import { scaleLinear } from 'd3-scale'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Item from '../item/index.js'
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
	background: isDraggingOver ? 'lightblue' : '#F2F2F2',
	padding: grid,
	minHeight: '100%'
})

export default class Itinerary extends Component {
	constructor(props) {
		super(props)

		this.state = {
			startTimeDialog: false,
			editCard: null,
			shift: false,
			newTime: null,
			readOnly: this.props.readOnly
		}

		this.openStartTimeDialog = this.openStartTimeDialog.bind(this)
		this.closeDialog = this.closeDialog.bind(this)
		this.toggleShift = this.toggleShift.bind(this)
		this.selectTime = this.selectTime.bind(this)
		this.updateStartTime = this.updateStartTime.bind(this)
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
				{this.renderBackButton()}
				<label className='itinerary-title'>
					{dayLabel}
				</label>
				{this.renderForwardButton()}
			</div>
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
					/>
				)
			} else {

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
				</div>
			)
		}
	}
}
