import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './index.scss'

class NavBar extends Component {
	constructor(props) {
		super(props)
		this.authenticated = true
		this.state = {
			background: this.props.background,
		}
	}

	renderOptions() {
		if (this.authenticated) {
			return (
				<div className='options'>
					<Link to='/workspace'><div>Explore</div></Link>
					<Link to='/'><div>New Trip</div></Link>
					<Link to='/dashboard'><div>Dashboard</div></Link>
					<Link to='/'><div>Log out</div></Link>
				</div>
			)
		} else {
			return (
				<div className='options'>
					<Link to='/workspace'><div>Explore</div></Link>
					<Link to='/'><div>Sign up</div></Link>
					<Link to='/'><div>Log in</div></Link>
				</div>
			)
		}
	}

	render() {
		return (
			<div>
				<div className={`${this.state.background} nav_bar`}>
					<Link to='/'><div className='logo'>planit</div></Link>
					{this.renderOptions()}
					
				</div>
			</div>
		)
	}
}

export default withRouter(NavBar)
