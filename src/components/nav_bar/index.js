import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import { createUser } from '../../actions/index.js'
import axios from 'axios'
import cookie from 'react-cookies'
import './index.scss'

class NavBar extends Component {
	constructor(props) {
		super(props)
		this.authenticated = true
		this.state = {
      background: this.props.background,
      authenticated: false,
		}

    this.processSuccess = this.processSuccess.bind(this)
    this.processFailure = this.processFailure.bind(this)
    this.processLogout = this.processLogout.bind(this)
    this.buttonDecision = this.buttonDecision.bind(this)
	}

  reloadPage() {
    window.location.reload()
  }

	renderOptions() {
		if (this.state.authenticated) {
			return (
				<div className='options'>
					<Link to='/explore'><div>Explore</div></Link>
					<Link to='/' onClick={this.reloadPage}><div>New Trip</div></Link>
					<Link to='/dashboard'><div>Dashboard</div></Link>
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
    this.setState({ authenticated: false })
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
	console.log("MAPESTATE TO PROPS")
	console.log(state);
  return {
    user_id: state.users.user_id,
  };
};

export default withRouter(connect(mapStateToProps, { createUser })(NavBar));
