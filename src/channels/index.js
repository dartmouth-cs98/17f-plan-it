import React from 'react'
import { Socket } from 'phoenix'

const user = 'AnonymousCoward'
const timeout = 10000
const URL = 'ws://localhost:4000/socket'
const socket = new Socket(URL, {})

export default class Channel {
  constructor(roomName, userName, updateFunction) {
    this.chan = this.connect(roomName, userName, updateFunction)
  }


  connect(roomName, userName, updateCardsFunction) {
    socket.connect({})
    const chan = socket.channel(`rooms:${roomName}`, { userName })

    // join the channel and listen for admittance
    chan.join()
      .receive('ignore', () => console.log('Channel access denied.'))
      .receive('ok', () => console.log('Channel access granted.'))
      .receive('timeout', () => console.log('Channel timedout.'))

    // channel-level event handlers
    chan.onError(event => console.log(event, 'Channel errored out.'))
    chan.onClose(event => console.log('Channel closed.'))

    //recieve new messages
    chan.on("new:msg:cards", payload => {
      //console.log("new message arrived", payload)
      updateCardsFunction(payload)
    })

    //user entering
    //chan.on("new:user:enter", payload => {
    //  console.log("new user enter", payload.body)
    //})

    return chan
  }

  send(message) {
    if (this.chan == null) {
      console.log("Channel is not initalized")
    } else {
      this.chan.push("new:msg:cards", {body: message})
    }
  }
}
