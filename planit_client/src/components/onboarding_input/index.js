import React, { Component } from 'react';
import './index.css';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';

class Onboarding_Input extends Component {
	constructor(props) {
		super(props)
		this.state = {
			placeholder: this.props.placeholder, 
			name: this.props.name,
			start_date: null, 
			end_date: null,
			start_focused: false,
			end_focused: false
		};

		this.onNameChange = this.onNameChange.bind(this);
	}

	onNameChange(event) {
		this.setState({ name: event.target.value });
	}

	onStartDateChange(event) {
		this.setState({ start_date: event.target.value });
	}

	onEndDateChange(event) {
		this.setState({ end_date: event.target.value });
	}

	render() {
		if (this.state.placeholder == 'Name your trip') {
			return (
				<input type='text' className='name_input' placeholder={this.state.placeholder}
					value={this.state.name}
					onChange={this.onNameChange}
				></input>
			)
		}
		else {
			return (
				<div className='multi_input'>
					<input type='text' className='other_input' placeholder={this.state.placeholder}
						value={this.state.name}
						onChange={this.onNameChange}
					></input>
					<SingleDatePicker
						  date={this.state.start_date} 
						  onDateChange={start_date => this.setState({ start_date })} 
						  focused={this.state.start_focused} 
						  onFocusChange={({ focused }) => this.setState({ start_focused: focused })} 
						  withPortal={true}
						  hideKeyboardShortcutsPanel={true}
						  className='date_input'
					/>
					<SingleDatePicker
						  date={this.state.end_date} 
						  onDateChange={end_date => this.setState({ end_date })} 
						  focused={this.state.end_focused} 
						  onFocusChange={({ focused }) => this.setState({ end_focused: focused })} 
						  className='date_input'
					/>
				</div>
			)
		}
	}
	
}

export default Onboarding_Input