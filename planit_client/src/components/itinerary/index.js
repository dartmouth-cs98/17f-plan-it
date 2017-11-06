import React, { Component } from 'react'
import $ from 'jquery'
import _ from 'lodash'
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
							className='fa fa-caret-left'
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
							className='fa fa-caret-right'
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
					label={`Day ${this.props.day}`}
				/>
				{this.renderForwardButton()}
			</div>
		)
	}

	renderList() {
		const toRender = _.map(this.props.cards, (card) => {
			if (card.type === 'free') {
				const selected = _.isNull(this.props.selected) ? null : (new Date(this.props.selected.start_time)).getTime() === (new Date(card.start_time)).getTime()

				return (
					<FreeTime
						duration={(new Date(card.end_time)).getTime() - (new Date(card.start_time)).getTime()}
						select={() => { this.props.selectTime(card)}}
						selected={selected}
					/>
				)
			} else if (card.type === 'travel') {
				return <Travel destination={card.destination} />
			} else {
				return (
					<Item
						key={card.id}
						name={card.name}
						description={card.description}
						remove={() => {
							this.props.removeCard(card.id, this.props.tripId, this.props.day)
						}}
					/>
				)
			}
		})

		return toRender
	}

	renderTimeScale() {
		const timeScale = scaleLinear()
			.domain([0, 24 * 60 * 60 * 1000])
			.range([0, 500])

		const ticks = _.map(this.props.cards, (card) => {
			const startTime = new Date(card.start_time)
			const timeString = `${_.padStart(startTime.getHours(), 2, '0')}:${_.padStart(startTime.getMinutes(), 2, '0')}`
			let height

			if (card.type === 'free') {
				height = timeScale((new Date(card.end_time)).getTime() - (new Date(card.start_time)).getTime())
			} else if (card.type === 'travel') {
				height = 64
			} else {
				height = 169
			}

			return (
				<div 
					className='time-tick'
					style={{height}}
				>
					{timeString}
				</div>
			)
		})

		return (
			<div className='time-scale'>
				{ticks}
			</div>
		)
	}

	render() {
		return (
			<div id='itinerary-box'>
				{this.renderHeader()}
				<div className='itinerary-body'>
					<div className='itinerary-list'>
						{this.renderList()}
					</div>
					{this.renderTimeScale()}
				</div>
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
		    			label='Change Start Time'
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
				className={this.props.selected ? 'free-time-selected' : 'free-time'}
				onClick={this.props.select}
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