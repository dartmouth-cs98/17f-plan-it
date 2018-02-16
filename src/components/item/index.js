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

		return (
			<div className='card-wrapper'>
				<div
					className='card item-card'
					style={{height: `${height}px`}}
				>
					<div className='card-header'>
						<label className='item-title'>
							{this.props.name}
						</label>
						{buttons}
					</div>
					<div className='card-body'>
						{this.renderBody()}
					</div>
				</div>
			</div>
		)
	}
}