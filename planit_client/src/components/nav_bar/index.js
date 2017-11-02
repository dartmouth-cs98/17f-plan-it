import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import cookie from 'react-cookies'
require('./index.scss')

class NavBar extends Component {
	constructor(props) {
		super(props)
		this.authenticated = true
		this.state = {
      background: this.props.background,
     auth_status: 'logged_out',
		}

    this.processSuccess = this.processSuccess.bind(this);
    this.processFailure = this.processFailure.bind(this);
    this.processLogout = this.processLogout.bind(this);
    this.buttonDecision = this.buttonDecision.bind(this);
	}

	renderOptions() {
		if (this.state.auth_status === 'logged_in') {
			return (
				<div className='options'>
					<Link to='/explore'><div>Explore</div></Link>
					<Link to='/'><div>New Trip</div></Link>
					<Link to='/dashboard'><div>Dashboard</div></Link>
					<Link to='/'><div><this.buttonDecision /></div></Link>
				</div>
			)
		} else {
			return (
				<div className='options'>
          <Link to='/workspace'><div>Explore</div></Link>
          <Link to='/'><div>Sign up</div></Link>
          <Link to='/'><div><this.buttonDecision /></div></Link>
				</div>
			)
		}
	}

  buttonDecision() {
    if (this.state.auth_status === 'logged_out') {
      return <GoogleLogin
        clientId="555169723241-887i7f31sng0979bpip7snih68v7bu1s.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.processSuccess}
        onFailure={this.processFailure}
        style={{}}
        className='nav-button'
        >
        <span>Login</span>
        </GoogleLogin>
    }

    return <button
      className='nav-button'
      onClick={this.processLogout}
    >Logout</button>;
  }

  componentWillMount() {
		var logged_in  ='logged_out'
		if (cookie.load('auth')){
			logged_in = 'logged_in'
		}
    this.setState({ auth_status:  logged_in });
  }

  processSuccess(response) {
    axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
  params: {
    id_token: response.tokenId,
  }})
     .then( (response) => {
       var seconds = new Date() / 1000;

       if ((response.data.aud === "555169723241-887i7f31sng0979bpip7snih68v7bu1s.apps.googleusercontent.com") &&
            ((response.data.iss === "accounts.google.com") || (response.data.iss === "https://accounts.google.com")) &&
            (response.data.exp > seconds)){
              // Success, process login and store cookie
              this.setState({ auth_status: 'logged_in' });
              cookie.save('auth', response, { path: '/' });
       }

     })
     .catch( (error) => {
       console.log(error);
     });
  }

  processFailure(response) {
    console.log(response);
  }

  processLogout(props) {
    this.setState({auth_status: 'logged_out'});
    cookie.remove('auth', { path: '/' });

  }

	render() {
		return (
      <div>
				<div className={`${this.state.background} nav_bar`}>
					<Link to='/'><div className='logo'>planit</div></Link>
					<div className='options'>
						{this.renderOptions()}
					</div>
				</div>
      </div>
		)
	}
}

export default withRouter(NavBar)
