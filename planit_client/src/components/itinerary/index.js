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
		start_datetime: '2017-10-28T10:30:15+00:00',
		end_datetime: '2017-10-28T11:30:15+00:00',
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
		start_datetime: '2017-10-28T11:45+00:00',
		end_datetime: '2017-10-28T12:45+00:00'
	}
]

export default class Itinerary extends Component {
	constructor(props) {
		super(props) 

		this.state = {
			day: 1, 
			data: [
				{
					date: 'November 14'
				}
			]
		}
	}

	renderHeader() {
		return (
			<div className='itinerary-header'>
				<FlatButton
					className='left-button'
					icon={
						<i
							class='fa fa-caret-left'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
				<FlatButton
					className='itinerary-label'
					label={`Day ${this.state.day}: ${this.state.data[this.state.day - 1].date}`}
				/>
				<FlatButton
					className='right-button'
					icon={
						<i
							class='fa fa-caret-right'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
			</div>
		)
	}

	renderList() {
		return (
			<div className='card-list'>

			</div>
		)
	}

	render() {
		return (
			<div id='itinerary-box'>
				{this.renderHeader()}
			</div>
		)
	}
}

class Item extends Component {

}

class Travel extends Component {

}