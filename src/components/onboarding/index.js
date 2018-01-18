import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import NavBar from '../nav_bar/index.js'
import Slider from'react-slick'
import OnboardingInput from '../onboarding_input'
import Modal from 'react-modal'
import { createTrip, createCard, fetchCards } from '../../actions/index.js'
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
			cities: [],
			modal_open: false
		}

		this.onAddCity = this.onAddCity.bind(this)
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

	componentWillReceiveProps(nextProps) {
		if (nextProps.trip_id !== null) {
			let cityCards = []
			let dayNumber = 1
			let startDate = (new Date(this.state.cities[0].start_date)).getTime()

			_.forEach(this.state.cities, (city) => {
				const duration = Math.round(((new Date(city.end_date)).getTime() - (new Date(city.start_date)).getTime()) / (24 * 60 * 60 * 1000))
				for (let i = 1; i <= duration; i++) {
					const cityCard = _.assign(city, {
						trip_id: nextProps.trip_id,
						type: 'city'
					})

					const endDate = startDate + (24 * 60 * 60 * 1000)

					cityCards.push({
						...cityCard,
						day_number: dayNumber++,
						start_time: new Date(startDate),
						end_time: new Date(endDate)
					})

					console.log(new Date(startDate), new Date(endDate))

					startDate = endDate
				}
			})

			this.props.createCard(cityCards)
			this.props.fetchCards(nextProps.trip_id, 1)
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
		let newCities = this.state.cities
		const first_city = _.assign(this.state.cities[0], { name })
		newCities[0] = first_city
		this.setState({ cities: newCities})
	}

	onNameChange(event) {
		this.setState({ trip_name: event.target.value })
	}

	onOtherNameChange(index, type, name) {
		let newCities = this.state.cities
		const newCity = _.assign(newCities[index], {	name })
		newCities[index] = newCity
		this.setState({ cities: newCities })
	}

	onHandleCitySelect(results, name) {
		getLatLng(results).then(({ lat, lng }) => {
			console.log(lat, lng)

			let address = results.formatted_address
			let place_id = results.place_id

			let newCities = this.state.cities
			const first_city = _.assign(newCities[0], {
				name,
				lat, 
				long: lng, 
				place_id,
				address
			})

			newCities[0] = first_city
			this.setState({ cities: newCities })
		})
	}

	onHandleSelect(index, type, results, name) {
		getLatLng(results).then(({ lat, lng }) => {
			console.log(lat, lng)

			if (type === 'city') {
				let address = results.formatted_address
				let day_number = index + 1
				let place_id = results.place_id
				let newCities = this.state.cities
				const newCity = _.assign(this.state.cities[index], {
					name, 
					address,
					day_number,
					lat, 
					long: lng,
					place_id
				})

				newCities[index] = newCity

				this.setState({ cities: newCities})
			}
		})
	}

	onStartDateChange(index, type, start_date) {
		const { end_date } = this.state.cities[index]
		if (_.isNil(end_date) || new Date(end_date) >= new Date(start_date)) {
			let newCities = this.state.cities
			const newCity = _.assign(this.state.cities[index], { start_date })
			newCities[index] = newCity
			this.setState({ cities: newCities })
		}
	}

	onEndDateChange(index, type, end_date) {
		const { start_date } = this.state.cities[index]
		if (_.isNil(start_date) || new Date(end_date) >= new Date(start_date)) {
			let newCities = this.state.cities

			// make sure you update the start date of the next city if there is one and valid against its end date
			if (index < this.state.cities.length - 1) {
				const nextDate = new Date((new Date(end_date)).getTime() + (24 * 60 * 60 * 1000))

				if (!_.isNil(this.state.cities[index + 1].end_date) && new Date(this.state.cities[index + 1].end_date) < nextDate) {
					// TODO: let user know that a city can't have the same end date as the next city
					return
				} else {
					const nextCity = _.assign(newCities[index + 1], { start_date: moment(nextDate) })
					newCities[index + 1] = nextCity
				}
			}

			// update the end date if it's ok
			const newCity = _.assign(this.state.cities[index], { end_date })
			newCities[index] = newCity
			this.setState({ cities: newCities })
		}
	}

	onAddCity(event) {
		console.log(this.state.cities)
		let latestDate
		let incomplete = false

		// input validation and getting the latest date to set the start date of next city
		_.forEach(this.state.cities, (city) => {
			if (_.isNil(city.start_date) || _.isNil(city.end_date)) {
				incomplete = true
			}

			if (_.isUndefined(latestDate) || new Date(city.end_date) > new Date(latestDate)) {
				latestDate = city.end_date
			}
		})

		if (incomplete) {
			// need to let user know that they're missing a date input
			return
		}

		const nextDate = new Date((new Date(latestDate)).getTime() + (24 * 60 * 60 * 1000))
		let newCities = this.state.cities
		newCities.push({
			type: 'city',
			name: '',
			start_date: _.isUndefined(latestDate) ? null : moment(nextDate),
			end_date: null
		})
		this.setState({ cities: newCities })
	}

	renderCities() {
		return (
			_.map(this.state.cities, (city, index) => {
				return (
					<div key={index}>
						<OnboardingInput
							index={index}
							placeholder={'City'}
							name={city.name}
							input_type='city'
							onOtherNameChange={this.onOtherNameChange}
							onStartDateChange={this.onStartDateChange}
							onEndDateChange={this.onEndDateChange}
							onHandleSelect={this.onHandleSelect}
							start_date={city.start_date}
							end_date={city.end_date}
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

		_.map(this.state.cities, (city) => {
			if (city.name === '' || city.start_date === null || city.end_date === null) {
				ok = false
			}

			if (_.isUndefined(startDate) || new Date(city.start_date) < new Date(startDate)) {
				startDate = city.start_date
			}

			if (_.isUndefined(endDate) || new Date(city.end_date) > new Date(endDate)) {
				endDate = city.end_date
			}
		})

		if (!ok || !cookie.load('auth')) {
			return (
				<div className='button_container start' onClick={this.onModalOpen}>
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

	cities_slide() {
		return (
			<div className='slide'>
				<div className='slide_title'>Where are you going?</div>
				<div className='scrollable'>
					{this.renderCities()}
					<div className='button_container add' onClick={this.onAddCity}>Add City</div>
					{this.renderStartTrip()}
				</div>
			</div>
		)
	}

	names_slide() {
		return (
			<div className='name_wrapper'>
				<OnboardingInput placeholder={'Name your trip'}
					onNameChange={this.onNameChange}
					name={this.state.trip_name}
				/>
			</div>
		)
	}

	renderStartCity() {
		const inputProps = {
		    value: _.isUndefined(this.state.cities[0]) ? '' : this.state.cities[0].name,
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
	      infinite: false,
	      speed: 500,
	      slidesToShow: 1,
	      slidesToScroll: 1,
	      nextArrow: <NextArrow/>,
	      prevArrow: <PrevArrow/>
    	};

    	let err_msg = !cookie.load('auth')? "Please log in first" : "Input at least one city with a start date"

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
				    className='card horizontal center no_outline'>
						<div className="card-content">
		        			<p>{err_msg}</p>
		        		</div>
					</Modal>
					<Slider {...onboarding_settings} className='onboarding_slider'>
						<div>{this.names_slide()}</div>
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

const mapDispatchToProps = (dispatch) => {
	return {
		createTrip: (name, user_id, start_time, end_time) => {
			dispatch(createTrip(name, user_id, start_time, end_time))
		}, 
		createCard: (cityCards) => {
			dispatch(createCard(cityCards))
		}, 
		fetchCards: (id, day) => {
			dispatch(fetchCards(id, day))
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Onboarding));
