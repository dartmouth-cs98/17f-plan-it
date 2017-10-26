import React, { Component } from 'react'
import $ from 'jquery'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './index.scss'

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