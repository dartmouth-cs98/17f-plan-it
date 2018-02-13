import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js'
import Slider from'react-slick'
import { Card, CardMedia } from 'material-ui/Card';
import PrevArrow from '../arrows/prev_arrow.js'
import NextArrow from '../arrows/next_arrow.js'
import { fetchTrips, fetchFavoritedTrips, resetTripId, viewTrip } from '../../actions/index.js';
import cookie from 'react-cookies'
import './index.scss'

class Dashboard extends Component {

	componentDidMount() {
		this.props.fetchTrips(cookie.load('auth'))
		this.props.fetchFavoritedTrips(cookie.load('auth'))
	}

	reloadPage() {
		window.location.reload()
	}

	viewTrip(tripId) {
		if (cookie.load('auth')) {
			this.props.viewTrip({ trip_id: tripId, user_id: cookie.load('auth'), last_visited: new Date()})
		}
	}

	renderTrips() {
		return this.props.userTrips.map((trip) => {
			return (
				<Link to={`/workspace/:${trip.id}`} key={trip.id}>
					<Card 
						className='trip_card'>
						<CardMedia className='card_img'>
				      		<img src={trip.photo_url} alt='' />
					    </CardMedia>
					    <div className='card_title'>{trip.name}</div>
					</Card>
				</Link>
			)
		})
	}

	renderFavoritedTrips() {
		return this.props.favoritedTrips.map((trip) => {
			return (
				<Link to={`/preview/:${trip.id}`} key={trip.id} onClick={()=>this.viewTrip(trip.id)}>
					<Card 
						className='trip_card'>
						<CardMedia className='card_img'>
				      		<img src={trip.photo_url} alt='' />
					    </CardMedia>
					    <div className='card_title'>{trip.trip_name}</div>
					</Card>
				</Link>
			)
		})
	}

	componentWillUnmount() {
		this.props.resetTripId();
	}

	render() {
		const dashboard_settings = {
	      dots: false,
	      infinite: false,
	      speed: 500,
	      slidesToShow: 4,
	      slidesToScroll: 4,
	      nextArrow: <NextArrow/>,
	      prevArrow: <PrevArrow/>
    	};

    	return (
			<div>
				<NavBar background={'road_trip_background'}/>
				<div>
					<div className='title'>My Trips</div>
					<Slider {...dashboard_settings} className='dashboard_slider'>
						{this.renderTrips()}
						<Link to='/' onClick={this.reloadPage}>
							<Card className='trip_card add_card'>
								<i className="fa fa-plus fa-5x plus_sign" aria-hidden="true"></i>
							</Card>
						</Link>
					</Slider>
					<div className='title'>Inspiration Board</div>
					<Slider {...dashboard_settings} className='dashboard_slider'>
						{this.renderFavoritedTrips()}
						<Link to='/explore'>
							<Card className='trip_card add_card'>
								<i className="fa fa-plus fa-5x plus_sign" aria-hidden="true"></i>
							</Card>
						</Link>
					</Slider>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    userTrips: state.trips.userTrips,
    favoritedTrips: state.trips.favoritedTrips
  };
};

export default withRouter(connect(mapStateToProps, { fetchTrips, fetchFavoritedTrips, resetTripId, viewTrip })(Dashboard));
