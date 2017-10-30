import React, { Component } from 'react'
import $ from 'jquery'
import {scaleLinear} from 'd3-scale'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import './index.scss'

const ITINERARY = [
	{
		id: 851093,
		type: 'Attraction',
		name: 'Thai Taiwanese Embassy',
		description: 'Two become one',
		start_datetime: 'October 28, 2017 9:45:00',
		end_datetime: 'October 28, 2017 10:30:00',
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
		start_datetime: 'November 14, 2017 10:45:00',
		end_datetime: 'November 14, 2017 11:45:00'
	}
]

export default class Itinerary extends Component {
	constructor(props) {
		super(props) 

		this.state = {
			day: 1, 
			data: [
				{
					date: 'November 14', 
					cards: ITINERARY
				},
				{
					date: 'November 15', 
					cards: ITINERARY
				}
			]
		}

		this.dayForward = this.dayForward.bind(this)
		this.dayBackward = this.dayBackward.bind(this)
	}

	dayForward() {
		this.setState({ day: Math.min(this.state.day + 1, this.state.data.length) })
	}

	dayBackward() {
		this.setState({ day: Math.max(this.state.day - 1, 1) })
	}

	renderBackButton() {
		if (this.state.day > 1) {
			return (
				<FlatButton
					className='left-button'
					onClick={this.dayBackward}
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
		console.log(this.state.data.length, this.state.day)

		if (this.state.day < this.state.data.length) {
			return (
				<FlatButton
					className='right-button'
					onClick={this.dayForward}
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
					label={`Day ${this.state.day}: ${this.state.data[this.state.day - 1].date}`}
				/>
				{this.renderForwardButton()}
			</div>
		)
	}

	renderList() {
		// scale to convert time units to positioning on itinerary
		const timeScale = scaleLinear()
			.domain([0, 1440])
			.range([0, 750])

		const cards = this.state.data[this.state.day - 1].cards.map((card) => {
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
			      actAsExpander={true}
			      showExpandableButton={true}
			    />
			    <CardActions>
			    	<FlatButton label='Remove' />
		    	</CardActions>
			    <CardText expandable={true}>
			      {this.props.description}
			    </CardText>
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