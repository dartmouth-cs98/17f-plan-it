import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js'
import Slider from'react-slick'
import { Card, CardMedia } from 'material-ui/Card';
import { fetchPublishedTrips, fetchTrendingTrips, fetchPopularTrips, fetchPublishDateTrips } from '../../actions/index.js';
import './index.scss'

function NextArrow(props) {
  const { onClick } = props
  return (
   	<div
      className='btn-floating btn-small waves-effect waves-light next_arrow'
      onClick={onClick}>
      <i className='fa fa-chevron-right vertical_center'></i>
   </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props
  return (
   	<div
      className='btn-floating btn-small waves-effect waves-light prev_arrow'
      onClick={onClick}>
      <i className='fa fa-chevron-left vertical_center'></i>
   </div>
  );
}

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

		if (trips.length != 0) {
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

	renderPublished(trips, max_trips) {
		let image = 'https://media.gadventures.com/media-server/cache/38/89/3889f45752d19449f909300bb0b7ad02.jpg'
		let counter = 0
		return trips.map((trip) => {
			counter += 1
			if (counter > max_trips) { return }
			return (
				<Link to={`/preview/:${trip.id}`} key={trip.id}>
					<Card className='trip_card'>
						<CardMedia className='card_img'>
				      		<img src={image} alt='' />
					    </CardMedia>
					    <div className='card_title'>{trip.name}</div>
					</Card>
				</Link>
			)
		})
	}

	render() {
    	let hasPublishedTrips = this.props.publishedTrips.length != 0

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

export default withRouter(connect(mapStateToProps, { fetchPublishedTrips, fetchTrendingTrips, fetchPopularTrips, fetchPublishDateTrips })(Explore));
