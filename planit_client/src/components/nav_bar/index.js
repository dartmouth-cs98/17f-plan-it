import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './index.css'

class NavBar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			background: this.props.background
		}
	}

	render() {
		return (
			<div>
				<div className={`${this.state.background} nav_bar`}>
					<Link to='/'><div className='logo'>planit</div></Link>
					<div className='options'>
						<Link to='/workspace'><div>Explore</div></Link>
						<Link to='/'><div>Sign up</div></Link>
						<Link to='/'><div>Log in</div></Link>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(NavBar)

