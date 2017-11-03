import React, { Component } from 'react'
import './index.scss'

export default class Toolbar extends Component {
	render() {
		return (
			<div id='tool-bar'>
				<div id='tool-bar-left'>
					<div id='tool-bar-cost-box' className='tool-bar-left-flex-item'>
						<div className='tool-bar-header-text'>
							Avg Cost
						</div>
						<div className='tool-bar-text'>
							$$$$
						</div>
					</div>
					<div id='tool-bar-travel-time-box' className='tool-bar-left-flex-item'>
						<div className='tool-bar-header-text'>
							Travel Time
						</div>
						<div className='tool-bar-text'>
							5 Hours
						</div>
					</div>
				</div>
				<div id='tool-bar-center'>
					<div id='toolbar-trip-title'>
						Southeast Asia
					</div>
				</div>
				<div id='tool-bar-right'>
					<a href="#" id='toolbar-share-button' className='tool-bar-header-text tool-bar-right-flex-item'>
						Share
					</a>
					<a href="#" id='toolbar-export-button' className='tool-bar-header-text tool-bar-right-flex-item'>
						Export
					</a>
				</div>
			</div>
		)
	}
}
