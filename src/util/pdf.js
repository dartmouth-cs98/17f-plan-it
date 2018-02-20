import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from 'axios'
import bluebird from 'bluebird'

import { ROOT_URL } from "../actions"

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export async function download(trip_id) {

  const queries = [
    `${ROOT_URL}/cards/itinerary?trip_id=${trip_id}`,
    `${ROOT_URL}/trips/${trip_id}`
  ]

  const responses = await bluebird.map(queries, function(query){
    return axios.get(query)
  })

  const cards = responses[0].data
  const trip = responses[1].data

  const content = format(trip, cards);

  console.log(content)
  pdfMake.createPdf(content).download();
}

export function format(trip, cards) {
    console.log("cards", cards)

    const trip_name = trip[0].name
    const start_date = formatDate(trip[0].start_time)
    const end_date = formatDate(trip[0].end_time)

    // Create array of arrays
    const days = [[]]

    // Get the first day
    let current_date = trip[0].start_time

    // Format cards into array
    for(let i = 0; i < cards.length; i++) {

      // Get a card and check that it's not a location card
      const current_card = cards[i]
      if (isLocationCard(current_card.start_time, current_card.end_time)) {
        continue;
      }


      if (getDateDiff(current_date, current_card.start_time) > 0) {
        let days_diff = getDateDiff(current_date, current_card.start_time)

        while (days_diff > 0) {
          days.push([])
          days_diff = days_diff - 1
        }
      }

      let attributes = formatCard(current_card)
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
        let day = addDay(trip[0].start_time, day_num)
        let date = formatDate(day)
        const header = {text: `Day ${day_num + 1} - ${date} \n\n`, style: 'subheader'}
        const day_cards = days[day_num]

        content.content.push(header)

        const day_content = {
          type: 'none',
          ul: day_cards

        }
        content.content.push(day_content)
      }

    return content


}


function formatCard(card) {
  const attributes = [
    card.name,
    `${formatTime(card.start_time)} - ${formatTime(card.end_time)}`,
    `${card.address}, ${card.city}, ${card.country}`,
    card.description,
    '\n'
  ]

  return attributes
}

// Change date to MM-DD-YYYY format
function formatDate(date) {
  var utc_date = new Date(date)
  var month = utc_date.getUTCMonth()+1
  var day = utc_date.getUTCDate()
  var year = utc_date.getUTCFullYear()

  return ('0' + month).slice(-2) + '/' + ('0' + day).slice(-2) + '/' + year

}
// Change time to HH:MM AM/PM format
function formatTime(dateTime) {
  var date_time = new Date(dateTime)
  var hour = date_time.getUTCHours()
  var am_pm = 'AM'
  if (hour >= 12) {
    am_pm = 'PM'
    hour = hour - 12
  }
  if (hour === 0) {
    hour = 12
  }
  var min =date_time.getUTCMinutes()

  return ('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2) + ' ' + am_pm

}

function addDay(date, days){
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result
}

function getDateDiff(datetime1, datetime2) {
  let date1 = new Date(datetime1)
  let date2 = new Date(datetime2)
  let utc1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate())
  let utc2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate())

  return Math.floor((utc2 - utc1) / (1000*60*60*24))
}


function isLocationCard(datetime1, datetime2) {

  let date1 = new Date(datetime1)
  let date2 = new Date(datetime2)

  if (date1.getUTCHours() === date2.getUTCHours() && date1.getUTCMinutes() === date2.getUTCMinutes()) {
    return true
  }
  return false
}

