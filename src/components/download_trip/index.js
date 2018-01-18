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

    const trip_name = this.props.trip[0].name
    const start_date = this.formatTime(this.props.trip[0].start_time)
    var end_date = this.formatTime(this.props.trip[0].end_time)

    const content =
      {
        content: [
          {text: trip_name, style: 'header'},
          {text: start_date + ' - ' + end_date, style: 'subheader'},

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
      `Start Time: ${this.formatTime(card.start_time)}`,
      `Address: ${card.address}`,
      `City: ${card.city}`,
      card.description,
    ]

    return attributes
  }

  //change the time format to something readable
  formatTime(date) {
    var utc_date = new Date(date)
    var month = utc_date.getUTCMonth()+1 
    var day = utc_date.getUTCDay()+1
    var year = utc_date.getUTCFullYear()

    return month + '/' + day + '/' + year

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
