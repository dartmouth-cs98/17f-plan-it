import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { heartbeatTimer, mainChannel } from '../../channels'
import { updateUsersLive } from '../../actions'


const USER_EXPIRATION = 1000;

class LiveUsers extends React.Component {
  constructor(props) {
    super(props)
    this.componentWillReceiveChannelUpdates = this.componentWillReceiveChannelUpdates.bind(this)
  }

  componentDidMount() {
    mainChannel.setUsersUpdateFunction(this.componentWillReceiveChannelUpdates)
  }

  componentWillReceiveChannelUpdates(payload) {
    this.props.updateUsersLive(payload)
  }

  renderUsers() {
    if (this.props.users) {
      return this.props.users.map(u => {
        if (Date.now() - u.tdd > USER_EXPIRATION) {
          return
        } else {
          return this.renderUser(u)
        }
      })
    }
  }

  renderUser(user) {
    const initials = user.fname.slice(0, 1) + user.lname.slice(0, 1);
    console.log("render users is called", initials)
    return (
      <div className='user-circle' key={user.email}>
        {initials}
      </div>
    )
  }

  render() {
    return (
      <div className='toolbar-live-users'>
        {this.renderUsers()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users.live_users
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUsersLive: (users) => {
      dispatch(updateUsersLive(users))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LiveUsers))
