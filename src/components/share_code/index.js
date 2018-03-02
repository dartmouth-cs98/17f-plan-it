import React from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { connect} from 'react-redux'
import Modal from 'react-modal'
import cookie from 'react-cookies'
import * as qs from 'qs'
import { checkEditPermission, giveEditPermission } from '../../actions'

import NavBar from '../nav_bar/index.js'
import Toolbar from '../tool_bar/index.js'
import './index.scss'

class ShareCode extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notFound: false,
    }

    this.renderFilling = this.renderFilling.bind(this)
    this.renderNotFound = this.renderNotFound.bind(this)
    this.renderPromptLogin = this.renderPromptLogin.bind(this)
    this.renderRedirect = this.renderRedirect.bind(this)
  }

  componentDidMount() {
    const search = qs.parse(this.props.location.search, {ignoreQueryPrefix: true})
    const userId = this.props.user.user_id
    const tripId = search.trip_id
    const shareCode = search.sharecode

    // if the query string parameters are not set correctly, then 404
    if (!shareCode || !tripId) {
      this.setState({notFound: true})
    }

    //if they are logged in, then add them to the edit permissions table
    if (userId && shareCode && tripId) {
      this.props.checkEditPermission(userId, tripId);
      this.props.giveEditPermission(userId, tripId, shareCode);
    } else if (userId){
      //if they are logged in, but do not have a share code
      //check to see if they have permissions
      this.props.checkEditPermission(userId, tripId)
    }
    //else there is nothing to check until they log in
  }


  componentWillReceiveProps(nextProps) {
    const search = qs.parse(this.props.location.search, {ignoreQueryPrefix: true})
    const userId = nextProps.user.user_id
    const tripId = search.trip_id
    const shareCode = search.sharecode
    this.props.checkEditPermission(userId, tripId);
    this.props.giveEditPermission(userId, tripId, shareCode);
  }


  renderNotFound() {
    return (
      <div>
        <div className='background'>
          <NavBar background={'no_background'} page={'ONBOARDING'}/>
          <div className="text"> Page not found in</div>
        </div>
        </div>
    )
  }

  renderPromptLogin() {
    return (
        <div>
        <div className='background'>
          <NavBar background={'no_background'} page={'ONBOARDING'}/>
          <div className="text"> Please sign up or log in</div>
        </div>
        </div>
    )
  }

  renderRedirect() {
    const search = qs.parse(this.props.location.search, {ignoreQueryPrefix: true})
    const tripId = search.trip_id
    const url = `/workspace/:${tripId}`
    return (
      <div>
        <div className='background'>
          <NavBar background={'no_background'} page={'ONBOARDING'}/>
          <div className="text"> Loading...</div>
        </div>
        <Redirect to={url}/>
      </div>
    )
  }

  renderFilling() {
    if (!this.props.user.user_id) {
      return this.renderPromptLogin()
    }
    if (this.props.permission) {
      return this.renderRedirect()
    }
      return this.renderNotFound()
  }
  //I check the permissions

  // then redirect them to the trip
  //if the are not logged in, prompt them to log in
  //this is going to be a seperate page
  render() {
    return (
      <div>
      {this.renderFilling()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.users,
    permission: state.permission.permission
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkEditPermission: (userId, tripId) => {
      dispatch(checkEditPermission(userId, tripId))
    },
    giveEditPermission: (userId, tripId, shareCode) => {
      dispatch(giveEditPermission(userId, tripId, shareCode))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShareCode))
