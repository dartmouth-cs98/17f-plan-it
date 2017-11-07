import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import NavBar from '../nav_bar/index.js'
import Slider from'react-slick'
import OnboardingInput from '../onboarding_input'
import { Map, List } from 'immutable'
import Modal from 'react-modal'
import { createTrip, createCard } from '../../actions/index.js'
import cookie from 'react-cookies'
import PlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete'
import moment from 'moment'
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
		this.onHandleSelect = this.onHandleSelect.bind(this)
		this.onHandleCitySelect = this.onHandleCitySelect.bind(this)
	}

	updatedItem(item, trip_id) {
		if (item.get('start_date') !== null) {
			item = item.set('start_date', item.get('start_date').toDate())
		}
		if (item.get('end_date') !== null) {
			item = item.set('end_date', item.get('end_date').toDate())
		}
		return item.set('trip_id', trip_id)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.trip_id !== null) {
			this.state.cities.forEach((city) => {
				this.props.createCard([this.updatedItem(city, nextProps.trip_id)])
			})
			this.state.hotels.forEach((hotel) => {
				this.props.createCard([this.updatedItem(hotel, nextProps.trip_id)])
			})
			this.state.must_dos.forEach((must_do) => {
				this.props.createCard([this.updatedItem(must_do, nextProps.trip_id)])
			})
			this.props.history.push(`/workspace/:${nextProps.trip_id}`)
		}
	}

	onCreateTrip(startDate, endDate) {

		this.props.createTrip({
			name: this.state.trip_name,
			user_id: cookie.load('auth'),
			start_time: startDate,
			end_time: endDate
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

	onCityChange(name) {
		const first_city = this.state.cities.get(0).set('name', name)
		const state_array = this.state.cities.set(0, first_city)
		this.setState({ cities: state_array})
	}

	onNameChange(event) {
		this.setState({ trip_name: event.target.value })
	}

	onOtherNameChange(index, type, name) {
		if (type === 'hotel') {
			const edited_hotel = this.state.hotels.get(index).set('name', name)
			const state_array = this.state.hotels.set(index, edited_hotel)
			this.setState({ hotels: state_array})
		} else if (type === 'city') {
			const edited_city = this.state.cities.get(index).set('name', name)
			const state_array = this.state.cities.set(index, edited_city)
			this.setState({ cities: state_array})
		} else {
			const edited_mustdo = this.state.must_dos.get(index).set('name', name)
			const state_array = this.state.must_dos.set(index, edited_mustdo)
			this.setState({ must_dos: state_array})
		}
	}

	onHandleCitySelect(results, name) {
		var lat = 0
		var lng = 0
		getLatLng(results).then(({ latitude, longitude }) => {
			lat = latitude
			lng = longitude
		})
		let address = results.formatted_address
		let place_id = results.place_id

		const first_city = this.state.cities.get(0).merge({
			name: name,
			lat: lat,
			lng: lng,
			place_id: place_id,
			address: address, 
			day_number: 1
		})
		const state_array = this.state.cities.set(0, first_city)
		this.setState({ cities: state_array})
	}

	onHandleSelect(index, type, results, name) {
		var lat = 0
		var lng = 0
		getLatLng(results).then(({ latitude, longitude }) => {
			lat = latitude
			lng = longitude
		})
		let address = results.formatted_address
		let day_number = index + 1
		let place_id = results.place_id

		if (type === 'hotel') {
			const edited_hotel = this.state.hotels.get(index).merge({
				name: name,
				address: address,
				day_number: day_number,
				lat: lat,
				lng: lng,
				place_id: place_id
			})
			const state_array = this.state.hotels.set(index, edited_hotel)
			this.setState({ hotels: state_array})
		} else if (type === 'city') {
			const edited_city = this.state.cities.get(index).merge({
				name: name,
				address: address,
				day_number: day_number,
				lat: lat,
				lng: lng,
				place_id: place_id
			})
			const state_array = this.state.cities.set(index, edited_city)
			this.setState({ cities: state_array})
		} else {
			const edited_mustdo = this.state.must_dos.get(index).merge({
				name: name,
				address: address,
				day_number: day_number,
				lat: lat,
				lng: lng,
				place_id: place_id
			})
			const state_array = this.state.must_dos.set(index, edited_mustdo)
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
				this.setState({ must_dos: state_array })
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
		console.log(this.state.cities)
		let latestDate
		let incomplete = false
		this.state.cities.map((city, index) => {
			if (_.isNil(city.get('start_date')) || _.isNil(city.get('end_date'))) {
				incomplete = true
			}

			if (_.isUndefined(latestDate) || new Date(city.get('end_date')) > new Date(latestDate)) {
				latestDate = city.get('end_date')
			}
		})

		if (incomplete) {
			// need to let user know that they're missing a date input
			return
		}

		const state_array = this.state.cities.push(Map({ type: 'city', name: '', start_date: _.isUndefined(latestDate) ? null : latestDate, end_date: null}))
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
							name={city.get('name')}
							input_type='city'
							onOtherNameChange={this.onOtherNameChange}
							onStartDateChange={this.onStartDateChange}
							onEndDateChange={this.onEndDateChange}
							onHandleSelect={this.onHandleSelect}
							start_date={city.get('start_date')}
							end_date={city.get('end_date')}
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
							name={hotel.get('name')}
							input_type='hotel'
							onOtherNameChange={this.onOtherNameChange}
							onStartDateChange={this.onStartDateChange}
							onEndDateChange={this.onEndDateChange}
							onHandleSelect={this.onHandleSelect}
							start_date={hotel.get('start_date')}
							end_date={hotel.get('end_date')}
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
							placeholder={'Must Do'}
							name={must_do.get('name')}
							input_type='must_do'
							onOtherNameChange={this.onOtherNameChange}
							onStartDateChange={this.onStartDateChange}
							onEndDateChange={this.onEndDateChange}
							onHandleSelect={this.onHandleSelect}
							start_date={must_do.get('start_date')}
							end_date={must_do.get('end_date')}
						/>
					</div>
				)
			})
		)
	}

	renderStartTrip() {
		let ok = true
		let startDate
		let endDate

		this.state.cities.map((city, index) => {
			if (city.get('name') === '' || city.get('start_date') === null || city.get('end_date') === null) {
				ok = false
			}

			if (_.isUndefined(startDate) || new Date(city.get('start_date')) < startDate) {
				startDate = city.get('start_date')
			} 

			if (_.isUndefined(endDate) || new Date(city.get('end_date')) > endDate) {
				endDate = city.get('end_date')
			}
		})

		if (!ok) {
			return (
				<div className='button_container start_disabled' onClick={this.onModalOpen}>
					Start Trip
				</div>
			)
		}
		else {
			return (
				<div className='button_container start' onClick={() => { this.onCreateTrip(startDate, endDate)}}>Start Trip</div>
			)
		}
	}

	name_slide() {
		return (
			<div>
				<OnboardingInput placeholder={'Name your trip'}
					onNameChange={this.onNameChange}
					name={this.state.trip_name}
				/>
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

	renderStartCity() {
		const inputProps = {
		    value: this.state.cities.get(0).get('name'),
		    onChange: (name) => { this.onCityChange(name) },
		    type: 'text',
		    placeholder: 'Where does your adventure begin?',
		    autoFocus: true,
		}
		const handleSelect = (address, placeId) => {
			geocodeByPlaceId(placeId)
			  .then(results => { this.onHandleCitySelect(results[0], address) })
		}
		const options = {
			types: ['(cities)']
		}
		const AutocompleteItem = ({ formattedSuggestion }) => (
	      <div className="suggestion_item">
	        <i className='fa fa-map-marker suggestion_icon'/>
	        <strong>{formattedSuggestion.mainText}</strong>{' '}
	        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
	      </div>
      	)

		return (
			<PlacesAutocomplete
				inputProps = { inputProps }
				onSelect = { handleSelect }
				autoCompleteItem = { AutocompleteItem }
				options = { options }
				googleLogo = { false }
				classNames = {{ root: 'start_input' }}
			/>
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
							{this.renderStartCity()}
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
					    className='card horizontal center no_outline'
				    >
							<div class="card-content">
			        	<p>Input at least one city with a start date</p>
			        </div>
						</Modal>
						<Slider {...onboarding_settings} className='onboarding_slider'>
			        <div>{this.name_slide()}</div>
			        <div>{this.cities_slide()}</div>
		      	</Slider>
					</div>
				</div>
			)
		}
	}
}

const mapStateToProps = (state) => {
	return {
		trip_id: state.trips.trip_id,
	};
};

export default withRouter(connect(mapStateToProps, { createTrip, createCard })(Onboarding));
