import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import { scaleLinear } from 'd3-scale'
import './index.scss'

export default class Item extends Component {
	renderBody() {
		if (this.props.buttons) {
			const hours = (new Date(this.props.startTime)).getHours()
			const mins = (new Date(this.props.startTime)).getMinutes()
			const durHours = Math.floor(this.props.duration / (1000 * 60 * 60))
			const durMins = Math.floor((this.props.duration % (1000 * 60 * 60)) / (1000 * 60))

			return (
				<div>
					<div className='time-edit'>
						<label className='time-label'>
							{`Starts: ${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`}
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
							{`Duration: ${durHours < 10 ? '0' : ''}${durHours}:${durMins < 10 ? '0' : ''}${durMins}`}
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
				</div>
			)
		} else {
			return			
		}
	}

	renderImage() {
		if (!this.props.buttons) {
			const photo_url = (this.props.photo_url != null)? this.props.photo_url : "https://vignette.wikia.nocookie.net/bokunoheroacademia/images/d/d5/NoPicAvailable.png/revision/latest?cb=20160326222204"
			const url = this.props.url
			return (
				<a href= {`${url}`}>
					<img src= {`${photo_url}`} alt="Test" height="84" width="84">
					</img>
				</a>
			)
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
			/>
		] : []

		const timeScale = scaleLinear()
			.domain([0, 24 * 60 * 60 * 1000])
			.range([0, this.props.timeScale])

		// subtract 10 for padding
		const height = timeScale(this.props.duration) - 10
		const title = (this.props.name.length > 38) ? this.props.name.substring(0, 37) + "..." : this.props.name

		if (this.props.buttons) {
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
						</div>
						<div className='card-body'>
							{this.renderBody()}
						</div>
					</div>
				</div>
			)
		} else {
			const line1 = this.props.type
			const line2 = this.props.rating + " • " + this.props.price
			// display state if the location is US. otherwise, display city and country name
			const line3 = (this.props.country === "United States" | this.props.country === "US")?
				this.props.address + ", " + this.props.city + ", " + this.props.state : 
				this.props.address + ", " + this.props.city + ", " + this.props.country
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