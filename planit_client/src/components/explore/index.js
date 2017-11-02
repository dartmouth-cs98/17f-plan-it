import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js'
import Slider from'react-slick'
import { Card, CardMedia } from 'material-ui/Card';
import { fetchTrips } from '../../actions/index.js';
import './index.scss'

class Explore extends Component {
	render() {
		return (
			<div>
				<NavBar background={'road_trip_background'}/>			
			</div>
		)
	}
}

export default withRouter(Explore);
