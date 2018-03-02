import React, { Component } from 'react'
import _ from 'lodash'
import 'react-dates/initialize'
import { SingleDatePicker } from 'react-dates'
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete'
import '../../react_dates_overrides.css'
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

      this.handleEnterKey = this.handleEnterKey.bind(this)
      this.renderAutocomplete = this.renderAutocomplete.bind(this)
    }

    handleEnterKey(e) {
      if (e.key == 'Enter') {
        this.props.next()
      }
    }

    renderAutocomplete() {
      const inputProps = {
        value: this.props.name,
        onChange: (name) => this.props.onOtherNameChange(this.state.index, this.state.input_type, name),
        type: 'text',
        placeholder: this.state.placeholder,
        autoFocus: false,
      }
      const handleSelect = (address, placeId) => {
        geocodeByPlaceId(placeId)
          .then((results) => { this.props.onHandleSelect(this.state.index, this.state.input_type, results[0], address) })
      }

      let types = ['(cities)']
      if (this.state.input_type !== 'city') {
          types = []
      }

      const google = window.google
      const location = this.props.lat && this.props.long? new google.maps.LatLng(this.props.lat, this.props.long) : null
      const radius = location? 100000 : null
      const options = {
        types,
        location,
        radius
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
          options = { options }
          classNames = {{ input: 'other_input' }}
          googleLogo = { false }
        />
      )
    }

    render() {
        const index = this.props.index

        if (this.state.placeholder === 'Name your trip' || this.state.placeholder === 'Name your card') {
          return (
            <input type='text' className='name_input' placeholder={this.props.placeholder}
              value={this.props.name}
              onChange={this.props.onNameChange}
              onKeyPress={this.handleEnterKey}
              ref={this.props.nameRef}
            />
          )
        } else if (this.state.placeholder === 'Enter image URL') {
          return (
            <input type='text' className='name_input' placeholder={this.props.placeholder}
              value={this.props.image_url}
              onChange={this.props.onImageChange}
              onKeyPress={this.handleEnterKey}
              ref={this.props.imageRef}
            />
          )
        } else if (this.state.placeholder === 'Enter a description') {
          return (
            <input type='text' className='name_input' placeholder={this.props.placeholder}
              value={this.props.description}
              onChange={this.props.onDescriptionChange}
            />
          )
        }
        else if (this.state.placeholder === 'Enter address or attraction name' || this.state.placeholder === 'Enter city') {
            return this.renderAutocomplete()
        } else if (this.state.placeholder === 'Please sign up or log in' ) {
          return (
            <input type='text' className='name_input' placeholder={this.props.placeholder} />
          )
        }
        else {
            let delete_classes = this.props.index === 0? 'fa fa-trash-o fa-2x delete_disabled' : 'fa fa-trash-o fa-2x delete'
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
                    <i className={delete_classes} onClick={() => this.props.onDeleteCity(this.props.index)}></i>
                </div>
            )
        }
    }

}



export default OnboardingInput
