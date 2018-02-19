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
    const response = await axios.get(`${ROOT_URL}/sharecode`);
    const url = window.location.href + "?" + response.data
    this.setState({url})
  }

  onClickHandler() {
    if (this.state.showButton) {
      this.generateURL()
    }
    this.setState({showButton: !this.state.showButton })
  }

  renderButtonText()  {
    if (this.state.showButton) {
      return "Invite Friends to Edit"
    } else {
      return this.state.url
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
