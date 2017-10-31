import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js'
import './index.scss'


class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {
    	return (
			<div>
				<NavBar background={'road_trip_background'}/>
			</div>
		)
	}
}

export default Dashboard
