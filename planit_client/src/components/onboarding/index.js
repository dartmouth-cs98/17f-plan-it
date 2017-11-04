import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import NavBar from '../nav_bar/index.js'
import Slider from'react-slick'
import OnboardingInput from '../onboarding_input'
import { Map, List } from 'immutable'
import Modal from 'react-modal'
import { createTrip } from '../../actions/index.js'
import cookie from 'react-cookies'
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

class Onboarding extends Component {
	constructor(props) {
		super(props)
		this.state = {
			landing_page: true,
			trip_name: '',
			cities: List([Map({ type: 'city', name: '', start_date: null, end_date: null})]),
			hotels: List([Map({ type: 'hotel', name: '', start_date: null, end_date: null})]),
			must_dos: List([Map({ type: 'must_do', name: '', start_date: null, end_date: null})]),
			modal_open: false
		}

		this.onAddCity = this.onAddCity.bind(this)
		this.onAddHotel = this.onAddHotel.bind(this)
		this.onAddMustDo = this.onAddMustDo.bind(this)
		this.onNameChange = this.onNameChange.bind(this)
		this.onOtherNameChange = this.onOtherNameChange.bind(this)
		this.onStartDateChange = this.onStartDateChange.bind(this)
		this.onEndDateChange = this.onEndDateChange.bind(this)
		this.onModalOpen = this.onModalOpen.bind(this)
		this.onModalClose = this.onModalClose.bind(this)
		this.onLetsGo = this.onLetsGo.bind(this)
		this.onCityChange = this.onCityChange.bind(this)
		this.onCreateTrip = this.onCreateTrip.bind(this)
	}

	onCreateTrip() {
		console.log(cookie.load('auth'))
		this.props.createTrip({
			name: this.state.trip_name,
			user_id: cookie.load('auth')
		})
	}

	onModalOpen(event) {
		this.setState( { modal_open: true } )
	}

	onModalClose(event) {
		this.setState( { modal_open: false } )
	}

	onLetsGo(event) {
		this.setState( { landing_page: false } )
	}

	onCityChange(event) {
		const first_city = this.state.cities.get(0).set('name', event.target.value)
		const state_array = this.state.cities.set(0, first_city)
		this.setState({ cities: state_array})
	}

	onNameChange(event) {
		this.setState({ trip_name: event.target.value })
	}

	onOtherNameChange(index, type, event) {
		if (type === 'hotel') {
			const edited_hotel = this.state.hotels.get(index).set('name', event.target.value)
			const state_array = this.state.hotels.set(index, edited_hotel)
			this.setState({ hotels: state_array})
		} else if (type === 'city') {
			const edited_city = this.state.cities.get(index).set('name', event.target.value)
			const state_array = this.state.cities.set(index, edited_city)
			this.setState({ cities: state_array})
		} else {
			const edited_mustdo = this.state.must_dos.get(index).set('name', event.target.value)
			const state_array = this.state.hotels.set(index, edited_mustdo)
			this.setState({ must_dos: state_array})
		}
	}

	onStartDateChange(index, type, start_date) {
		if (type === 'hotel') {
			const end_date = this.state.hotels.get(index).get('end_date');
			if (end_date === null || new Date(end_date) >= new Date(start_date)) {
				const edited_date = this.state.hotels.get(index).set('start_date', start_date);
				const state_array = this.state.hotels.set(index, edited_date);
				this.setState({ hotels: state_array })
			}
		} else if (type === 'city') {
			const end_date = this.state.cities.get(index).get('end_date');
			if (end_date === null || new Date(end_date) >= new Date(start_date)) {
				const edited_date = this.state.cities.get(index).set('start_date', start_date);
				const state_array = this.state.cities.set(index, edited_date);
				this.setState({ cities: state_array })
			}
		} else {
			const end_date = this.state.must_dos.get(index).get('end_date');
			if (end_date === null || new Date(end_date) >= new Date(start_date)) {
				const edited_date = this.state.must_dos.get(index).set('start_date', start_date);
				const state_array = this.state.must_dos.set(index, edited_date);
				this.setState({ hotels: state_array })
			}
		}

	}

	onEndDateChange(index, type, end_date) {
		if (type === 'hotel') {
			const start_date = this.state.hotels.get(index).get('start_date')
			if (start_date === null || new Date(end_date) >= new Date(start_date)) {
				const edited_date = this.state.hotels.get(index).set('end_date', end_date)
				const state_array = this.state.hotels.set(index, edited_date)
				this.setState({ hotels: state_array })
			}
		} else if (type === 'city') {
			const start_date = this.state.cities.get(index).get('start_date')
			if (start_date === null || new Date(end_date) >= new Date(start_date)) {
				const edited_date = this.state.cities.get(index).set('end_date', end_date)
				const state_array = this.state.cities.set(index, edited_date)
				this.setState({ cities: state_array })
			}
		} else {
			const start_date = this.state.must_dos.get(index).get('start_date')
			if (start_date === null || new Date(end_date) >= new Date(start_date)) {
				const edited_date = this.state.must_dos.get(index).set('end_date', end_date)
				const state_array = this.state.must_dos.set(index, edited_date)
				this.setState({ must_dos: state_array })
			}
		}
	}

	onAddCity(event) {
		console.log('pushed')
		const state_array = this.state.cities.push(Map({ type: 'city', name: '', start_date: null, end_date: null}))
		this.setState({ cities: state_array })
	}

	onAddHotel(event) {
		const state_array = this.state.hotels.push(Map({ type: 'hotel', name: '', start_date: null, end_date: null}))
		this.setState({ hotels: state_array })
	}

	onAddMustDo(event) {
		const state_array = this.state.must_dos.push(Map({ type: 'must_do', name: '', start_date: null, end_date: null}))
		this.setState({ must_dos: state_array })
	}

	renderCities() {
		return (
			this.state.cities.map((city, index) => {
				return (
					<div key={index}>
						<OnboardingInput
							index={index}
							placeholder={'City'}
							information={city}
							onOtherNameChange={this.onOtherNameChange}
							onStartDateChange={this.onStartDateChange}
							onEndDateChange={this.onEndDateChange}
						/>
					</div>
				)
			})
		)
	}

	renderHotels() {
		return (
			this.state.hotels.map((hotel, index) => {
				return (
					<div key={index}>
						<OnboardingInput
							index={index}
							placeholder={'Hotel'}
							information={hotel}
							onOtherNameChange={this.onOtherNameChange}
							onStartDateChange={this.onStartDateChange}
							onEndDateChange={this.onEndDateChange}
						/>
					</div>
				)
			})
		)
	}

	renderMustDos() {
		return (
			this.state.must_dos.map((must_do, index) => {
				return (
					<div key={index}>
						<OnboardingInput
							index={index}
							placeholder={'Attraction'}
							information={must_do}
							onOtherNameChange={this.onOtherNameChange}
							onStartDateChange={this.onStartDateChange}
							onEndDateChange={this.onEndDateChange}
						/>
					</div>
				)
			})
		)
	}

	renderStartTrip() {
		if (this.state.cities.get(0).get('name') === '' || this.state.cities.get(0).get('start_date') === null) {
			return (
				<div className='button_container start_disabled' onClick={this.onModalOpen}>
					Start Trip
				</div>
			)
		}
		else {
			return (
				<Link to='/workspace'>
					<div className='button_container start' onClick={this.onCreateTrip}>Start Trip</div>
				</Link>
			)
		}
	}

	name_slide() {
		return (
			<div>
				<OnboardingInput placeholder={'Name your trip'}
					onNameChange={this.onNameChange}
					name={this.state.trip_name}/>
			</div>
		)
	}

	cities_slide() {
		return (
			<div className='slide'>
				<div className='slide_title'>Where are you going?</div>
				<div className='scrollable'>
					{this.renderCities()}
					<div className='button_container add' onClick={this.onAddCity}>Add</div>
				</div>
				{this.renderStartTrip()}
			</div>
		)
	}

	hotels_slide() {
		return (
			<div className='slide'>
				<div className='slide_title'>Where are you staying?</div>
				<div className='scrollable'>
					{this.renderHotels()}
					<div className='button_container add' onClick={this.onAddHotel}>Add</div>
				</div>
				{this.renderStartTrip()}
			</div>
		)
	}

	mustdo_slide() {
		return (
			<div className='slide'>
				<div className='slide_title'>Any must do's?</div>
				<div className='scrollable'>
					{this.renderMustDos()}
					<div className='button_container add' onClick={this.onAddMustDo}>Add</div>
				</div>
				{this.renderStartTrip()}
			</div>
		)
	}

	render() {
		const onboarding_settings = {
	      dots: true,
	      infinite: true,
	      speed: 500,
	      slidesToShow: 1,
	      slidesToScroll: 1,
	      nextArrow: <NextArrow/>,
	      prevArrow: <PrevArrow/>
    	};

    	if (this.state.landing_page) {
    		return (
				<div>
					<div className='landing_page'>
						<NavBar background={'no_background'} page={'ONBOARDING'}/>
						<div className='buttons centered'>
							<input type='text' placeholder='Where does your adventure begin?' 
								onChange={this.onCityChange}
								className='landing_input'/>
							<div className='button_box' onClick={this.onLetsGo}>Let's go</div>
						</div>
					</div>
				</div>
			)
    	} else {
			return (
				<div>
					<div className='onboarding'>
						<NavBar background={'no_background'} page={'ONBOARDING'}/>
						<Modal
						    isOpen={this.state.modal_open}
						    onRequestClose={this.onModalClose}
						    className='card horizontal center no_outline'>
							<div class="card-content">
					        	<p>Input at least one city with a start date</p>
					        </div>
						</Modal>
						<Slider {...onboarding_settings} className='onboarding_slider'>
					        <div>{this.name_slide()}</div>
					        <div>{this.cities_slide()}</div>
					        <div>{this.hotels_slide()}</div>
					        <div>{this.mustdo_slide()}</div>
				      	</Slider>
					</div>
				</div>
			)
		}
	}
}

export default withRouter(connect(null, { createTrip })(Onboarding));
