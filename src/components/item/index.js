import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import { scaleLinear } from 'd3-scale'
import './index.scss'

export default class Item extends Component {
	render() {
		const buttons = [
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
						className='fa fa-clock-o'
						style={{color: '#000000'}}
					/>
				}
				onClick={this.props.editCard}
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
		]

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
					<label className='item-title'>
						{this.props.name}
					</label>
					{buttons}
				</div>
				<label>
					{`${new Date(this.props.startTime)}`}
				</label>
				<label>
					{`${new Date(this.props.endTime)}`}
				</label>
			</div>
		)
	}
}