import React from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { connect} from 'react-redux'
import Modal from 'react-modal'
import cookie from 'react-cookies'
import * as qs from 'qs'
import { checkEditPermission, giveEditPermission } from '../../actions'

class ShareCode extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notFound: false


    }

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
    if (cookie.load('auth') && shareCode && tripId) {
      console.log("User is logged in, giving edit permission")
      console.log(this.props.user)
      this.props.giveEditPermission(userId, tripId, shareCode);
    } else {
      //if they are logged in, but do not have a share code
      //check to see if they have permissions
      console.log("checking edit permissions")
      this.props.checkEditPermission(userId, tripId)
    }

    this.props.checkEditPermission(userId, tripId)
  }


  renderNotFound() {
    return (
      <div>
        Page not found
      </div>
    )
  }

  renderRedirect() {
    const search = qs.parse(this.props.location.search, {ignoreQueryPrefix: true})
    const tripId = search.trip_id
    const url = `/workspace/:${tripId}`
    return (
      <Redirect to={url} />
    )
  }

  //I check the permissions

  // then redirect them to the trip
  //if the are not logged in, prompt them to log in
  //this is going to be a seperate page
  render() {
    if (this.state.notFound) {
      return this.renderNotFound()
    }
    if (this.props.permission) {
      return this.renderRedirect()
    }
    return (
      <div> Please log in </div>
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
