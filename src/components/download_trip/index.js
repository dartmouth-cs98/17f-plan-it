import React, { Component } from 'react'
import {connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { download } from '../../util/pdf'

//Samuel Lee

export class DownloadTrip extends Component {
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

const mapStateToProps = (state) => {
  return {
    trip: state.trips.trip,
    cards: state.cards.all
  }
}


export default withRouter(connect(mapStateToProps)(DownloadTrip))
