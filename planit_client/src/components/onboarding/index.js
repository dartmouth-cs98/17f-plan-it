import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../nav_bar/index.js';
import Slider from'react-slick';
import Onboarding_Input from '../onboarding_input'
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
			cities: [(<Onboarding_Input placeholder={'City'} name={this.props.city_name}/>)],
			hotels: [(<Onboarding_Input placeholder={'Hotel'}/>)],
			must_dos: [(<Onboarding_Input placeholder={'Attraction'}/>)]
		};
		this.onAddCity = this.onAddCity.bind(this)
		this.onAddHotel = this.onAddHotel.bind(this)
		this.onAddMustDo = this.onAddMustDo.bind(this)
	}

	onAddCity(event) {
		this.setState({ cities: this.state.cities.concat(<Onboarding_Input placeholder={'City'}/>) })
	}

	onAddHotel(event) {
		this.setState({ hotels: this.state.hotels.concat(<Onboarding_Input placeholder={'Hotel'}/>) })
	}
	onAddMustDo(event) {
		this.setState({ must_dos: this.state.must_dos.concat(<Onboarding_Input placeholder={'Attraction'}/>) })
	}

	name_slide() {
		return (
			<div>
				<Onboarding_Input placeholder={'Name your trip'}/>
			</div>
		)
	}

	cities_slide() {
		return (
			<div className='slide'>
				<div className='title'>Where are you going?</div>
				{this.state.cities}
				<div className='add' onClick={this.onAddCity}>Add</div>
			</div>
		)
	}

	hotels_slide() {
		return (
			<div className='slide'> 
				<div className='title'>Where are you staying?</div>
				{this.state.hotels}
				<div className='add' onClick={this.onAddHotel}>Add</div>
			</div>
		)
	}

	mustdo_slide() {
		return (
			<div className='slide'>
				<div className='title'>Any must do's?</div>
				<Onboarding_Input placeholder={'Attraction'}/>
				{this.state.must_dos}
				<div className='add' onClick={this.onAddMustDo}>Add</div>
			</div>
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
