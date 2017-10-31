import React, { Component } from 'react'
import $ from 'jquery'
import {scaleLinear} from 'd3-scale'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import './index.scss'

export default class Itinerary extends Component {
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
		// scale to convert time units to positioning on itinerary
		const timeScale = scaleLinear()
			.domain([0, 1440])
			.range([0, 750])

		const cards = this.props.itinerary.cards.map((card) => {
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
							this.props.removeCard(card.id)
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