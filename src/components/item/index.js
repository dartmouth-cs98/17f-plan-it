import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import ReactTooltip from 'react-tooltip'
import { scaleLinear } from 'd3-scale'
import './index.scss'

export default class Item extends Component {
	renderBody() {
		if (this.props.buttons) {
			let startHours = (new Date(this.props.startTime)).getHours()
			const startMins = (new Date(this.props.startTime)).getMinutes()
			let startPm = false
			if (startHours > 11) startPm = true
			if (startHours > 12) startHours -= 12
			if (startHours === 0) startHours = 12

			let endHours = (new Date(this.props.endTime)).getHours()
			const endMins = (new Date(this.props.endTime)).getMinutes()
			let endPm = false
			if (endHours > 11) endPm = true
			if (endHours > 12) endHours -= 12
			if (endHours === 0) endHours = 12

			let travel_text_class = 'travel-estimate'
			if (this.props.is_last_card) {
				travel_text_class = 'white-travel-estimate'
			}

			return (
				<div>
					<div className='time-edit'>
						<label className='time-label'>
							{`Starts: ${startHours < 10 ? '0' : ''}${startHours}:${startMins < 10 ? '0' : ''}${startMins} ${startPm ? 'PM' : 'AM'}`}
						</label>
						<FlatButton
							className='edit-icon'
							icon={
								<i
									className='fa fa-plus'
									style={{color: '#000000'}}
								/>
							}
							onClick={() => {
								const newTime = (new Date(this.props.startTime)).getTime() + (15 * 60 * 1000)
								this.props.updateTime(this.props.cardId, new Date(newTime))
							}}
						/>
						<FlatButton
							className='edit-icon'
							icon={
								<i
									className='fa fa-minus'
									style={{color: '#000000'}}
								/>
							}
							onClick={() => {
								const newTime = (new Date(this.props.startTime)).getTime() - (15 * 60 * 1000)
								this.props.updateTime(this.props.cardId, new Date(newTime))
							}}
						/>
					</div>
					<div className='time-edit'>
						<label className='time-label'>
							{`Ends: ${endHours < 10 ? '0' : ''}${endHours}:${endMins < 10 ? '0' : ''}${endMins} ${endPm ? 'PM' : 'AM'}`}
						</label>
						<FlatButton
							className='edit-icon'
							icon={
								<i
									className='fa fa-plus'
									style={{color: '#000000'}}
								/>
							}
							onClick={() => {
								const newDuration = (new Date(this.props.endTime)).getTime() - (new Date(this.props.startTime)).getTime() + (15 * 60 * 1000)
								this.props.updateDuration(this.props.cardId, newDuration)
							}}
						/>
						<FlatButton
							className='edit-icon'
							icon={
								<i
									className='fa fa-minus'
									style={{color: '#000000'}}
								/>
							}
							onClick={() => {
								const newDuration = (new Date(this.props.endTime)).getTime() - (new Date(this.props.startTime)).getTime() - (15 * 60 * 1000)
								this.props.updateDuration(this.props.cardId, newDuration)
							}}
						/>
					</div>
					<div className={travel_text_class}>
						Estimated travel time to next location is {this.props.travel_duration}
					</div>
				</div>
			)
		} else {
			return
		}
	}

	renderImage() {
		if (!this.props.buttons) {
			if (this.props.source === "Custom") {
				const photo_url = (this.props.photo_url != null)? this.props.photo_url : "https://vignette.wikia.nocookie.net/bokunoheroacademia/images/d/d5/NoPicAvailable.png/revision/latest?cb=20160326222204"
				return (
					<img src= {`${photo_url}`} alt="Test" height="84" width="84">
					</img>
				)
			} else {
				const photo_url = (this.props.photo_url != null)? this.props.photo_url : "https://vignette.wikia.nocookie.net/bokunoheroacademia/images/d/d5/NoPicAvailable.png/revision/latest?cb=20160326222204"
				const url = this.props.source === "Yelp" ? this.props.url : `http://${this.props.url}`
				return (
					<a target="_blank" href= {url}>
						<img src= {`${photo_url}`} alt="Test" height="84" width="84">
						</img>
					</a>
				)
			}
		}
	}

	render() {
		const buttons = this.props.buttons ? [
			<FlatButton
				className='item-icon'
				icon={
					<i
						className='fa fa-trash-o'
						style={{color: '#000000'}}
					/>
				}
				onClick={this.props.remove}
				data-tip
				data-for='deleteTip'
			/>,
			<FlatButton
				className='item-icon'
				icon={
					<i
						className='fa fa-search'
						style={{color: '#000000'}}
					/>
				}
				onClick={this.props.search}
				data-tip
				data-for='searchTip'
			/>
		] : []

		const timeScale = scaleLinear()
			.domain([0, 24 * 60 * 60 * 1000])
			.range([0, this.props.timeScale])

		// subtract 10 for padding
		const height = timeScale(this.props.duration) - 10
		const title = (this.props.name.length > 38) ? this.props.name.substring(0, 37) + "..." : this.props.name

		if (this.props.buttons) {
			// this is an itinerary card
			return (
				<div className='card-wrapper'>
					<div
						className='card item-card'
						style={{height: `${height}px`}}
					>
						<div className='card-header'>
							<label className='item-title'>
								{title}
							</label>
							{buttons}
							<ReactTooltip id='searchTip' effect='solid' offset={{ bottom: 5 }}>
								<span>Search from this location</span>
							</ReactTooltip>
							<ReactTooltip id='deleteTip' effect='solid' offset={{ bottom: 5 }}>
								<span>Delete this item</span>
							</ReactTooltip>
						</div>
						<div className='card-body'>
							{this.renderBody()}
						</div>
					</div>
				</div>
			)
		} else {
			if (this.props.source === "Custom") { // display custom card
				return (
					<div className='card-wrapper'>
						<div
							className='card item-card2'
							style={{height: `${height}px`}}>
							<div className='card-header2'>
								<label className='item-title2'>
									{this.props.name}
								</label>
								<div className='card-body2'>
									<div class = "textrow">Custom</div>
									<div class = "textrow">{this.props.address}</div>
									<div class = "commentrow">Comment: {this.props.description}</div>
								</div>
							</div>
							<div id="imageContainer">
								{this.renderImage()}
							</div>
						</div>
					</div>
				)
			} else {
				const line1 = this.props.type == null ? "Description not available" : this.props.type
				const rating = this.props.rating == null ? "Rating not available" : this.props.rating
				const price = this.props.price == null ? "Price not available" : this.props.price
				const line2 = rating + " • " + price
				// display state if the location is US. otherwise, display city and country name
				let line3
				if (this.props.address == null) {
					line3 = "No address available"
				} else {
					line3 = (this.props.country === "United States" | this.props.country === "US")?
					this.props.address + ", " + this.props.city + ", " + this.props.state :
					this.props.address + ", " + this.props.city + ", " + this.props.country
				}
				const line4 = "Source: " + this.props.source
				return (
					<div className='card-wrapper'>
						<div
							className='card item-card2'
							style={{height: `${height}px`}}>
							<div className='card-header2'>
								<label className='item-title2'>
									{this.props.name}
								</label>
								<div className='card-body2'>
									<div class = "textrow">{line1}</div>
									<div class = "textrow">{line2}</div>
									<div class = "textrow">{line3}</div>
									<div class = "textrow">{line4}</div>
								</div>
							</div>
							<div id="imageContainer">
								{this.renderImage()}
							</div>

						</div>

					</div>
				)
			}
		}
	}
}