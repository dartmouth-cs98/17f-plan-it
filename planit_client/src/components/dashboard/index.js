import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js'
import Slider from'react-slick'
import { Card, CardMedia } from 'material-ui/Card';
import { fetchTrips } from '../../actions/index.js';
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


class Dashboard extends Component {

	componentDidMount() {
		this.props.fetchTrips(1)
	}


	renderTrips() {
		let image = 'https://media.gadventures.com/media-server/cache/38/89/3889f45752d19449f909300bb0b7ad02.jpg'
		console.log(this.props.allTrips)
		return this.props.userTrips.map((trip) => {
			return (
				<Link to={`/workspace/:${trip.id}`}>
					<Card onClick={() => this.onClickTrip(trip.id)}>
						<CardMedia className='card_img'>
				      		<img src={image} alt='' />
					    </CardMedia>
					    <div className='card_title'>Thailand Trip</div>
					</Card>
				</Link>
			)
		})
	}

	render() {
		let settings = {
	      dots: true,
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
					<Slider {...settings} className='slider'>
						{this.renderTrips()}
						<Link to='/'>
							<Card className='trip_card add_card'>
								<i className="fa fa-plus fa-5x plus_sign" aria-hidden="true"></i>
							</Card>
						</Link>
					</Slider>
					<div className='title'>Inspiration Board</div>
					<Slider {...settings} className='slider'>
						{this.renderTrips()}
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
    userTrips: state.trips.userTrips
  };
};

export default withRouter(connect(mapStateToProps, { fetchTrips })(Dashboard));
