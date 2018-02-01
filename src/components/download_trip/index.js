import React, { Component } from 'react'
import { download } from '../../util/pdf'

//Samuel Lee
export default class DownloadTrip extends Component {
  constructor(props) {
    super(props)
    this.download = this.download.bind(this)
  }

  async download() {
    await download(this.props.tripId);
  }

  render() {
    return (
    <div>
      <button onClick={this.download}>
        Download as PDF
      </button>
    </div>
    )
  }
}

