import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js';
import './index.css'

let onboarding_screens = ['NAME', 'CITIES', 'HOTELS', 'MUST_DOS']

class Onboarding extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "My Bangkok Trip",
			screen: onboarding_screens[0],
			cities: {
				"Bangkok": [new Date(), new Date()]
			}, 
			hotels: {
				"Marriott": [new Date(), new Date()]
			},
			must_dos: {

			}
		}
	}

	renderItineraryList() {

	}

	render() {
		return (
			<div>
				<div className='onboarding'>
					<NavBar background={'no_background'}/>
				</div>
			</div>
		)
	}
}

export default Onboarding
