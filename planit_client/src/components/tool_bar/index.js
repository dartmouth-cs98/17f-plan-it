import React, { Component } from 'react'
import './index.scss'

export default class Toolbar extends Component {
	render() {
		return (
			<div id='tool-bar'>
				<div id='tool-bar-center'>
					<div id='toolbar-trip-title'>
						{this.props.tripName}
					</div>
				</div>
			</div>
		)
	}
}
