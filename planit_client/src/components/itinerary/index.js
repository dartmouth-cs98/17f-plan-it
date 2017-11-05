import React, { Component } from 'react'
import $ from 'jquery'
import _ from 'lodash'
import {scaleLinear} from 'd3-scale'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import './index.scss'

const TRAVEL_TIME = 900000

export default class Itinerary extends Component {
	constructor(props) {
		super(props) 

		this.formatCards = this.formatCards.bind(this)
	}

	componentDidUpdate() {
		console.log(this.props.cards)
		this.formatCards()
	}

	formatCards() {
		let cardList = []
		let startCard
		let prevEnd
		let startOfDay

		_.each(this.props.cards, (card) => {
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

		return cardList
	}

	renderBackButton() {
		if (this.props.backArrow) {
			return (
				<FlatButton
					className='left-button'
					onClick={this.props.dayBackward}
					icon={
						<i
							class='fa fa-caret-left'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
			)
		}
	}

	renderForwardButton() {
		if (this.props.forwardArrow) {
			return (
				<FlatButton
					className='right-button'
					onClick={this.props.dayForward}
					icon={
						<i
							class='fa fa-caret-right'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
			)
		}
	}

	renderHeader() {
		return (
			<div className='itinerary-header'>
				{this.renderBackButton()}
				<FlatButton
					className='itinerary-label'
					label={`Day ${this.props.day}: ${this.props.itinerary.date}`}
				/>
				{this.renderForwardButton()}
			</div>
		)
	}

	renderList() {
		const cards = this.formatCards()
		console.log(cards)

		const toRender = _.map(cards, (card) => {
			if (card.type === 'free') {
				return <FreeTime duration={(new Date(card.end_time)).getTime() - (new Date(card.start_time)).getTime()} />
			} else if (card.type === 'travel') {
				return <Travel destination={card.destination} />
			} else {
				return (
					<Item
						key={card.id}
						name={card.name}
						description={card.description}
						select={() => {
							this.props.selectCard(card)
						}}
						remove={() => {
							this.props.removeCard(card)
						}}
					/>
				)
			}
		})

		return toRender
	}

	render() {
		return (
			<div id='itinerary-box'>
				{this.renderHeader()}
				{this.renderList()}
			</div>
		)
	}
}

class Item extends Component {
	render() {
		return (
			<div className='card-wrapper'>
				<Card>
			    <CardHeader
			      title={this.props.name}
			      actAsExpander={false}
			      showExpandableButton={false}
			    />
			    <CardText expandable={false}>
			      {this.props.description}
			    </CardText>
			    <CardActions>
			    	<FlatButton 
			    		label='Remove'
			    		onClick={this.props.remove}
		    		/>
		    	</CardActions>
			  </Card>
		  </div>
  	)
	}
}

class FreeTime extends Component {
	render() {
		// scale to convert time units to positioning on itinerary
		const timeScale = scaleLinear()
			.domain([0, 24 * 60 * 60 * 1000])
			.range([0, 500])

		const height = timeScale(this.props.duration)

		return (
			<div 
				className='free-time'
				style={{height: `${height}px`}}
			>
			</div>
		)
	}
}

class Travel extends Component {
	render() {
		return (
			<div className='card-wrapper'>
				<Card>
			    <CardHeader
			      title={`Travel to: ${this.props.destination}`}
			      actAsExpander={false}
			      showExpandableButton={false}
			    />
			  </Card>
		  </div>
		)
	}
}