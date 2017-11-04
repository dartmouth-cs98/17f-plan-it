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

		_.each(this.props.cards, (card) => {
			if (_.isUndefined(startCard)) {
				console.log(card) 
				startCard = card.id	

				const startTime = new Date(card.start_time)
				const startOfDay = new Date(`${startTime.getMonth() + 1}/${startTime.getDate()}/${startTime.getFullYear()}`)

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
					travelType: card.travelType
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

		console.log(cardList)
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
		if (this.props.itinerary.cards.length === 0) {
			return 
		}

		// scale to convert time units to positioning on itinerary
		const timeScale = scaleLinear()
			.domain([0, 1440])
			.range([0, 750])

		// reorder cards based on id pointers
		const currentCard = _.find(this.props.itinerary.cards, (card) => {
			return card.id === this.props.itinerary.startCard
		})

		let orderedCards = [currentCard]

		while(true) {
			const nextCard = _.find(this.props.itinerary.cards, (card) => {
				return card.id === orderedCards[orderedCards.length - 1].next
			})

			if (!_.isUndefined(nextCard)) {
				orderedCards.push(nextCard)
			} else {
				break
			}
		}

		const cards = orderedCards.map((card) => {
			if (card.type === 'Attraction') {
				const start = new Date(card.start_datetime)
				const end = new Date(card.end_datetime)

				const time = Math.abs(end - start) / 60000
				const height = timeScale(time)

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
						style={{height: `${height}px`}}
					/>
				)
			} else {
				return (
					<Travel
						key={card.id}
					/>
				)
			}
		})

		return cards
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
		    		<FlatButton
		    			label='Select'
		    			onClick={this.props.select}
	    			/>
		    	</CardActions>
			  </Card>
		  </div>
  	)
	}
}

class Travel extends Component {
	render() {
		return (
			<div className='travel-bar'>
				Travel
			</div>
		)
	}
}