import React, { Component } from 'react'
import {connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { fetchTrip, fetchCards } from '../../actions/index.js'
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

    console.log("props", this.props)

    const trip_name = this.props.trip[0].name
    const start_date = this.formatDate(this.props.trip[0].start_time)
    const end_date = this.formatDate(this.props.trip[0].end_time)

    // Get all cards for this trip
    // const cards = this.props.fetchCards(this.props.tripId)

    // Create array of arrays
    const days = [[]]

    // Get the first day
    let current_date = this.props.trip[0].start_time
    for(let i = 0; i < this.props.cards.length; i++) {

      // Get the current day
      const current_card = this.props.cards[i]

      if (this.getDateDiff(current_date, current_card.start_time) > 0) {
        let days_diff = this.getDateDiff(current_date, current_card.start_time)

        while (days_diff > 0) {
          days.push([])
          days_diff = days_diff - 1 
        }
      }

      let attributes = this.formatCard(current_card)
      days[days.length-1].push(attributes)
      current_date = current_card.start_time
    }

    let content =
      {
        content: [
          {text: trip_name, style: 'header'},
          {text: start_date + ' - ' + end_date + '\n\n', style: 'subheader'},
        ]
      }

      for(let day_num = 0; day_num < days.length; day_num++) {
        const header = {text: `Day ${day_num + 1} \n\n`, style: 'subheader'}
        const day_cards = days[day_num]
        day_cards.unshift(header)

        const day_content = {
          type: 'none',
          ul: day_cards

        }
        content.content.push(day_content)
      }

    return content
  }

  //returns a list of the attributes of the card in string form
  formatCard(card) {

    const attributes = [
      card.name,
      `${this.formatTime(card.start_time)} - ${this.formatTime(card.end_time)}`,
      `${card.address}, ${card.city}, ${card.country}`,
      card.description,
      '\n'
    ]

    return attributes
  }


  // Change date to MM-DD-YYYY format
  formatDate(date) {
    var utc_date = new Date(date)
    var month = utc_date.getUTCMonth()+1 
    var day = utc_date.getUTCDay()+1
    var year = utc_date.getUTCFullYear()

    return month + '/' + day + '/' + year

  }

  // Change time to HH:MM AM/PM format
  formatTime(dateTime) {
    var date_time = new Date(dateTime)
    var hour = date_time.getUTCHours() 
    var am_pm = 'AM'
    if (hour >= 12) {
      am_pm = 'PM'
      hour = hour - 12
    }
    if (hour == 0) {
      hour = 12
    }
    var min =date_time.getUTCMinutes()

    return ('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2) + ' ' + am_pm

  }

  // Gets the difference in days between two dates
  getDateDiff(datetime1, datetime2) {
    let date1 = new Date(datetime1)
    let date2 = new Date(datetime2)
    let utc1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDay())
    let utc2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDay())

    return Math.floor((utc2 - utc1) / (1000*60*60*24))
  }

  addDay(date, days){
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result
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
      console.log("hello")
      dispatch(fetchCards(id))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DownloadTrip))
