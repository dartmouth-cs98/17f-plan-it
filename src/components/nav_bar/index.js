import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import { createUser, resetTripId } from '../../actions/index.js'
import storage from 'redux-persist/lib/storage'
import axios from 'axios'
import cookie from 'react-cookies'
import './index.scss'

class NavBar extends Component {
	constructor(props) {
		super(props)
		this.authenticated = true //what is this? Do you use this? -Sam
		this.state = {
      background: this.props.background,
      authenticated: cookie.load('auth'),
		}

    this.processSuccess = this.processSuccess.bind(this)
    this.processFailure = this.processFailure.bind(this)
    this.processLogout = this.processLogout.bind(this)
    this.buttonDecision = this.buttonDecision.bind(this)
	}

  componentDidMount() {
    this.props.authUser(cookie.load('auth'))
  }

  reloadPage() {
    this.props.resetTripId()
    window.location.reload()
  }

	reloadPageRoot() {
    this.props.resetTripId()
		window.location.href = "/";
  }

	renderOptions() {
		if (this.state.authenticated) {
			return (
				<div className='options'>
					<Link to='/explore'><div>Explore</div></Link>
					<Link to='/' onClick={this.reloadPage}><div>New Trip</div></Link>
					<Link to='/dashboard'><div>My Trips</div></Link>
					<Link to='/'><div><this.buttonDecision /></div></Link>
				</div>
			)
		} else {
			return (
				<div className='options_logged_out'>
          <Link to='/explore'><div>Explore</div></Link>
          <Link to='/'><div>{this.buttonDecision()}</div></Link>
				</div>
			)
		}
	}

  buttonDecision() {
    if (!this.state.authenticated) {
      return <GoogleLogin
        clientId="555169723241-887i7f31sng0979bpip7snih68v7bu1s.apps.googleusercontent.com"
        buttonText="Sign Up/Login"
        onSuccess={this.processSuccess}
        onFailure={this.processFailure}
        style={{}}
        className='nav-button'
        >
        </GoogleLogin>
    }

    return <div
      className='nav-button'
      onClick={this.processLogout}
      >Logout</div>;
  }

  componentWillMount() {
		if (cookie.load('auth')){
			this.setState({ authenticated: true });
		} else {
      this.setState({ authenticated: false });
    }
  }

  componentDidUpdate() {
    if (this.state.authenticated) {
      cookie.save('auth', this.props.user_id, { path: '/' })
    } else {
      cookie.remove('auth', { path: '/' })
      this.reloadPage()
    }
  }

  processSuccess(response) {
    axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', { params: { id_token: response.tokenId, }}).then( (response) => {
       var seconds = new Date() / 1000;
       if ((response.data.aud === "555169723241-887i7f31sng0979bpip7snih68v7bu1s.apps.googleusercontent.com") &&
        ((response.data.iss === "accounts.google.com") || (response.data.iss === "https://accounts.google.com")) &&
        (response.data.exp > seconds)){
          this.props.createUser(
          {
            email: response.data.email,
            fname: response.data.given_name,
            lname: response.data.family_name

          })
          this.props.authUser(true)
          this.setState({ authenticated: true });
       }
     }).catch( (error) => {
       console.log(error);
     });
  }

  processFailure(response) {
    console.log(response);
  }

  processLogout(props) {
    cookie.remove('auth', { path: '/' })
		storage.removeItem('persist:root')
    this.props.resetTripId()
    this.setState({ authenticated: false })
    this.reloadPageRoot()
  }

	render() {
		return (
      <div>
				<div className={`${this.state.background} nav_bar`}>
					<Link to='/' onClick={this.reloadPage}><div className='logo'>planit</div></Link>
						{this.renderOptions()}
				</div>
      </div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    user_id: state.users.user_id,
    authenticated: state.users.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { createUser, resetTripId })(NavBar));
