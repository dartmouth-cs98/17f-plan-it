import React from 'react'
import axios from 'axios'
import { ROOT_URL } from '../../actions/'


//This should only be rendered if the user is not an annon
class CollabButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showButton: true,
      url: "loading"
    }
  }

  async generateURL() {
    console.log(this.props.tripId)
    const response = await axios.get(`${ROOT_URL}/sharecode?trip_id=${this.props.tripId}`);
    const currentURL = window.location.protocol + window.location.hostname;

    const url = currentURL + "/share" + "?sharecode=" + response.data + "&trip_id=" + this.props.tripId
    this.setState({url})
  }

  onClickHandler() {
    this.props.onCollabOpen()
    // if (this.state.showButton) {
    //   //this.generateURL()
    //   this.props.onCollabOpen()
    // }
    // this.setState({showButton: !this.state.showButton })
  }

  renderButtonText()  {
    if (this.state.showButton) {
      return "Invite Friends to Edit"
    } else {
      return "Sharing with friends"
      //this.state.url
    }
  }

  render() {
    return (
      <button className='toolbar-click' onClick={() => this.onClickHandler()}>
        {this.renderButtonText()}
      </button>
    )
  }
}

export default CollabButton
