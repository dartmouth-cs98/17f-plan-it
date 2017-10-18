import React, { Component } from 'react'
import './index.css'
import Toolbar from '../tool_bar/index.js'
import Suggestions from '../suggestions/index.js'
import Itinerary from '../itinerary/index.js'
import NavBar from '../nav_bar/index.js'
import Map from '../map/index.js'

export default class Workspace extends Component {
	render() {
		return (
			<div id='workspace'>
				<NavBar background={'globe_background'}/>
				<Toolbar />
				<div className='planner'>
					<Suggestions />
					<Itinerary />
					<Map isInfoOpen={false} isMarkerShown={true} MarkerPosition={{ lat: 43.704441, lng: -72.288694 }} center={{ lat: 43.704441, lng: -72.288694 }} infoMessage="Hello From Dartmouth"/>
				</div>
			</div>
		)
	}
}
