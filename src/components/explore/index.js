import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js'
import Slider from'react-slick'
import { Card, CardMedia } from 'material-ui/Card';
import PrevArrow from '../arrows/prev_arrow.js'
import NextArrow from '../arrows/next_arrow.js'
import cookie from 'react-cookies'
import { fetchPublishedTrips, fetchTrendingTrips, fetchPopularTrips, fetchPublishDateTrips, resetTripId, viewTrip } from '../../actions/index.js';
import './index.scss'

class Explore extends Component {

	componentDidMount() {
		this.props.fetchPublishDateTrips()
		this.props.fetchTrendingTrips()
		this.props.fetchPopularTrips()
		this.props.fetchPublishedTrips()
	}

	renderTripList(trips, max_trips, title) {
		const explore_settings = {
	      dots: false,
	      infinite: false,
	      speed: 500,
	      slidesToShow: 4,
	      slidesToScroll: 4,
	      nextArrow: <NextArrow/>,
	      prevArrow: <PrevArrow/>
    	};

		if (trips.length !== 0) {
			return (
				<div>
				<div className='title'>{title}</div>
				<Slider {...explore_settings} className='explore_slider'>
					{this.renderPublished(trips, max_trips)}
				</Slider>
				</div>
			)
		} else {
			return
		}
	}

	viewTrip(tripId) {
		if (cookie.load('auth')) {
			this.props.viewTrip({ trip_id: tripId, user_id: cookie.load('auth'), last_visited: new Date()})
		}
	}

	renderPublished(trips, max_trips) {
		let counter = 0
		return trips.map((trip) => {
			counter += 1
			if (counter > max_trips) { return <div/>}
			return (
				<Link to={`/preview/:${trip.id}`} key={trip.id} onClick={()=>this.viewTrip(trip.id)}>
					<Card className='trip_card'>
						<CardMedia className='card_img'>
				      		<img src={trip.photo_url} alt='' />
					    </CardMedia>
					    <div className='card_title'>{trip.name}</div>
					</Card>
				</Link>
			)
		})
	}

	componentWillUnmount() {
		this.props.resetTripId()
	}

	render() {
    	let hasPublishedTrips = this.props.publishedTrips.length !== 0

    	if (hasPublishedTrips) {
			return (
			<div>
				<NavBar background={'road_trip_background'}/>
				<div>
					{this.renderTripList(this.props.publishedDateTrips, 20, 'Recently Published Trips')}
					{this.renderTripList(this.props.publishedTrendingTrips, 20,'Trending Now')}
					{this.renderTripList(this.props.publishedPopularTrips, 20, 'Popular Trips')}
					{this.renderTripList(this.props.publishedTrips, 20, 'All Trips')}
				</div>			
			</div>
			)
    	} else {
    		return (
			<div>
				<NavBar background={'road_trip_background'}/>
				<div className='title'>Oops! No published trips yet!</div>		
			</div>
		)
    	}
	}
}

const mapStateToProps = (state) => {
  return {
    publishedDateTrips: state.trips.publishedDateTrips,
    publishedTrendingTrips: state.trips.publishedTrendingTrips,
    publishedPopularTrips: state.trips.publishedPopularTrips,
    publishedTrips: state.trips.publishedTrips
  };
};

export default withRouter(connect(mapStateToProps, { fetchPublishedTrips, fetchTrendingTrips, fetchPopularTrips, fetchPublishDateTrips, resetTripId, viewTrip })(Explore));
