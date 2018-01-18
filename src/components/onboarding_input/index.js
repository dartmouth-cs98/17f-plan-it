import React, { Component } from 'react'
import 'react-dates/initialize'
import { SingleDatePicker } from 'react-dates'
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete'
import './index.scss'

class OnboardingInput extends Component {
	constructor(props) {
		super(props)

		this.state = {
			placeholder: this.props.placeholder,
			input_type: this.props.input_type,
			index: this.props.index,
			start_focused: false,
			end_focused: false,
		}

		this.renderAutocomplete = this.renderAutocomplete.bind(this)
	}

	renderAutocomplete() {
		const inputProps = {
		    value: this.props.name,
		    onChange: (name) => this.props.onOtherNameChange(this.state.index, this.state.input_type, name),
		    type: 'text',
		    placeholder: this.state.placeholder,
		    autoFocus: true,
		}
		const handleSelect = (address, placeId) => {
			geocodeByPlaceId(placeId)
			  .then((results) => { this.props.onHandleSelect(this.state.index, this.state.input_type, results[0], address) })
		}
		let types = ['(cities)']
		if (this.state.input_type === 'hotel') {
			types = ['establishment']
		}
		if (this.state.input_type === 'must_do') {
			types = ['geocode', 'establishment']
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
				onEnterKeyDown = { handleSelect }
				autoCompleteItem = { AutocompleteItem }
				options = {{ types }}
				classNames = {{ input: 'other_input' }}
				googleLogo = { false }
			/>
		)
	}

	render() {
		const index = this.props.index

		if (this.state.placeholder === 'Name your trip') {
			return (
				<input type='text' className='name_input' placeholder={this.props.placeholder}
					value={this.props.name}
					onChange={this.props.onNameChange}
				/>
			)
		}
		else {
			return (
				<div className='multi_input'>
					{this.renderAutocomplete()}
					<SingleDatePicker
						date={this.props.start_date}
						onDateChange={(start_date) => this.props.onStartDateChange(index, this.state.input_type, start_date)}
						focused={this.state.start_focused}
						onFocusChange={({ focused }) => { if (index === 0) { this.setState({ start_focused: focused }) }}}
						withPortal={true}
						hideKeyboardShortcutsPanel={true}
					/>
					<SingleDatePicker
						date={this.props.end_date}
						onDateChange={(end_date) => this.props.onEndDateChange(index, this.state.input_type, end_date)}
						focused={this.state.end_focused}
						onFocusChange={({ focused }) => this.setState({ end_focused: focused })}
						withPortal={true}
						hideKeyboardShortcutsPanel={true}
					/>
				</div>
			)
		}
	}

}



export default OnboardingInput
