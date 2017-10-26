import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './index.scss'

export default class Itinerary extends Component {
	renderHeader() {
		return (
			<div className='itinerary-header'>
				<label className='itinerary-title'>
					Itinerary
				</label>
				<FlatButton
					className='itinerary-menu'
					icon={
						<i
							class='fa fa-bars'
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