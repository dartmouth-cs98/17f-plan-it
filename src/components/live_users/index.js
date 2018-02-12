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
    // so have logi
    // so users looks like an email as the key,
    // time created as value
    //
    //const users = ["Sam Lee", "Helen He", "Jeff Gao"]
    const users = ["SL", "HH", "JG"]
    //if (this.props.users) {
    //  const keys  = Object.keys(this.props.users)
    //  return keys.map(k => {
    //    console.log(Date.now() - this.props.users[k])
    //    if (Date.now() - this.props.users[k] > USER_EXPIRATION) {
    //      return
    //    } else {
    //      this.renderUser(k)
    //    }
    //  })
    //}
    return users.map(u => this.renderUser(u))
  }

  renderUser(user) {
    return (
      <div className='user-circle'>
        {user}
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
