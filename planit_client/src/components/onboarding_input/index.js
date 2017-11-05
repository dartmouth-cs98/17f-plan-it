import React, { Component } from 'react'
import 'react-dates/initialize'
import { SingleDatePicker } from 'react-dates'
require('./index.scss')

class OnboardingInput extends Component {
	constructor(props) {
		super(props)

		this.state = {
			placeholder: this.props.placeholder,
			start_focused: false,
			end_focused: false
		}
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
					<input type='text' className='other_input' placeholder={this.props.placeholder}
						value={this.props.information.get('name')}
						onChange={(event) =>
							this.props.onOtherNameChange(index, this.props.information.get('type'), event)}
					/>
					<SingleDatePicker
						date={this.props.information.get('start_date')}
						onDateChange={(start_date) => this.props.onStartDateChange(index, this.props.information.get('type'), start_date)}
						focused={this.state.start_focused}
						onFocusChange={({ focused }) => this.setState({ start_focused: focused })}
						withPortal={true}
						hideKeyboardShortcutsPanel={true}
					/>
					<SingleDatePicker
						date={this.props.information.get('end_date')}
						onDateChange={(end_date) => this.props.onEndDateChange(index, this.props.information.get('type'), end_date)}
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
