import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { heartbeatTimer, mainChannel } from '../../channels'
import { updateUsersLive } from '../../actions'


class LiveUsers extends React.Component {
  constructor(props) {
    super(props)
    this.componentWillReceiveChannelUpdates = this.componentWillReceiveChannelUpdates.bind(this)
  }

  componentDidMount() {
    console.log(this.componentWillReceiveChannelUpdates)
    mainChannel.setUsersUpdateFunction(this.componentWillReceiveChannelUpdates)
  }

  componentWillReceiveChannelUpdates(payload) {
    console.log("this is the pre payload", payload)
    this.props.updateUsersLive(payload)
  }

  renderUsers() {
    // so have logi
    console.log("users", this.props.users)
    console.log("channel", mainChannel)
    if (this.props.users) {
      return this.props.users.map(u => this.renderUser(u))
    }
    return
  }

  renderUser(user) {
    return (
      <div>
        {user.name}
      </div>
    )
  }

  render() {
    return (
      <div>
        <span>
        "WHAT IS GOING ON HERE
        </span>
        {this.renderUsers()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.live_users
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
