import React from 'react'
import { generateUUID } from '../../util/random'

//This should only be rendered if the user is not an annon
class CollabButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showButton: true
    }
  }

  generateURL() {
    const id = generateUUID()
    return window.location.href + "?" + id
  }

  onClickHandler() {
    this.setState({showButton: !this.state.showButton })
  }

  renderButtonText()  {
    if (this.state.showButton) {
      return "Invite Friends to Edit"
    } else {
      return this.generateURL()
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
