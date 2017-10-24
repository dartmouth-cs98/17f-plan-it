import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js';
import Slider from'react-slick';
import './index.css';

function NextArrow(props) {
  const {className, style, onClick} = props
  return (
   	<div
      className='btn-floating btn-small waves-effect waves-light next_arrow'
      onClick={onClick}>
      <i class='fa fa-chevron-right vertical_center'></i>
   </div>
  );
}

function PrevArrow(props) {
  const {className, style, onClick} = props
  return (
   	<div
      className='btn-floating btn-small waves-effect waves-light prev_arrow'
      onClick={onClick}>
      <i class='fa fa-chevron-left vertical_center'></i>
   </div>
  );
}

class Onboarding extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: null,
			cities: {}, 
			hotels: {},
			must_dos: {}
		}
	}

	name_slide() {
		return (
			<div>
				<input type='text' className='name_input' placeholder='Name your trip'></input>
			</div>
		)
	}

	cities_slide() {
		return (
			<div>1</div>
		)
	}

	hotels_slide() {
		return (
			<div>1</div>
		)
	}

	mustdo_slide() {
		return (
			<div>1</div>
		)
	}

	render() {
		let settings = {
	      dots: true,
	      infinite: true,
	      speed: 500,
	      slidesToShow: 1,
	      slidesToScroll: 1,
	      nextArrow: <NextArrow/>,
	      prevArrow: <PrevArrow/>
    	};

		return (
			<div>
				<div className='onboarding'>
					<NavBar background={'no_background'}/>
					<Slider {...settings} className='slider'>
				        {this.name_slide()}
				        {this.cities_slide()}
				        {this.hotels_slide()}
				        {this.mustdo_slide()}
			      </Slider>
				</div>
			</div>
		)
	}
}

export default Onboarding
