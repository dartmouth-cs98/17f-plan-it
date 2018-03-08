import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { heartbeatTimer, mainChannel } from '../../channels'
import { updateUsersLive, deleteUserLive } from '../../actions'

const USER_EXPIRATION = heartbeatTimer * 2; //if someone is inactive for 2 heartbeats then they are expired

class LiveUsers extends React.Component {
  constructor(props) {
    super(props)
    this.componentWillReceiveChannelUpdates = this.componentWillReceiveChannelUpdates.bind(this)
    setInterval(() => this.removeExpiredUsers(), USER_EXPIRATION)
  }

  componentDidMount() {
    mainChannel.setUsersUpdateFunction(this.componentWillReceiveChannelUpdates)
  }

  componentWillReceiveChannelUpdates(payload) {
    this.props.updateUsersLive(payload)
  }

  removeExpiredUsers() {
    if (this.props.users) {
      this.props.users.map(u => {
        if (Date.now() - u.tdd > USER_EXPIRATION) {
          this.props.deleteUserLive(u)
        }
      })
    }
  }

  renderUsers() {
    if (this.props.users instanceof Array) {
      const renderedUsers = this.props.users.map(u => {
        let fInit = "a"
        if (!_.isNil(u.fname)) {
          fInit = u.fname.slice(0, 1)
        }
        let lInit = "a"
        if (!_.isNil(u.lname)){
          lInit = u.lname.slice(0, 1)
        }

        return this.renderUser(fInit + lInit)
      })
      return renderedUsers
    }

  }

  renderUser(initials) {
    return (
      <div className='user-circle' key={initials}>
        {initials}
      </div>
    )
  }

  render() {
    return(
      this.renderUsers()
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
    },
    deleteUserLive: (user) => {
      dispatch(deleteUserLive(user))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LiveUsers))
