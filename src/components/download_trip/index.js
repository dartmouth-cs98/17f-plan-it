import React, { Component } from 'react'
import {connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { fetchTrip, fetchCards } from '../../actions'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

//Samuel Lee

pdfMake.vfs = pdfFonts.pdfMake.vfs;


export class DownloadTrip extends Component {
  constructor(props) {
    super(props)

    this.download = this.download.bind(this)
    this.format = this.format.bind(this)
    this.formatCard = this.formatCard.bind(this)
  }

  async download() {
    await this.props.fetchTrip(this.props.tripId) //updates the super store of information (redux)
    await this.props.fetchCards(this.props.tripId)

    const content = this.format()

    pdfMake.createPdf(content).download();
  }


  format() {
    //need to orgnaize the cards
    // Then seperate them by day
    // Then put them into the unordered list
    const cards = this.props.cards.map((c) => this.formatCard(c))

    const tripName = this.props.trip[0].name

    const content =
      {
        content: [
          {text: tripName, style: 'header'},
          {
            ul: cards
          }
        ]
      }
    return content
  }

  //returns a list of the attributes of the card in string form
  formatCard(card) {
    const attributes = [
      `Start Time: ${card.start_time}`,
      `Address: ${card.address}`,
      `City: ${card.city}`,
      card.description,
    ]

    return attributes
  }

  //change the time format to something readable
  formatTime(card) {


  }


  render() {
    return (
    <div>
      <button onClick={this.download}>
        Download
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

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTrip: (id) => {
      dispatch(fetchTrip(id))
    },
    fetchCards: (id) => {
      dispatch(fetchCards(id))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DownloadTrip))
