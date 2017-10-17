import React, { Component } from 'react'
import './index.css'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import Map from '../map/index.js'

export default class Workspace extends Component {
	render() {
		return (
			<div id='workspace'>
				<Toolbar />
				<div className='planner'>
					<Suggestions />
					<Itinerary />
					<Map />
				</div>
			</div>
		)
	}
}