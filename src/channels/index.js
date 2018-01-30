import React from 'react'
import { Socket } from 'phoenix'

const user = 'AnonymousCoward'
const body = 'I got something to say.'
const timeout = 10000
const url = 'ws://localhost:4000/socket'
const socket = new Socket(url, {})

export function connectSocket(room_name) {
  socket.connect({})
  const chan = socket.channel(`rooms:${room_name}`, { user })

  // join the channel and listen for admittance
  chan.join()
    .receive('ignore', () => console.log('Access denied.'))
    .receive('ok', () => console.log('Access granted.'))
    .receive('timeout', () => console.log('Must be MongoDB.'))

  // channel-level event handlers
  chan.onError(event => console.log('Channel blew up.'))
  chan.onClose(event => console.log('Channel closed.'))

  //recieve new messages
  chan.on("new:msg", payload => console.log(payload.body))

  //user entering
  chan.on("new:user", payload => console.log(payload.body))

  console.log("finished connecting")

  return chan
}

export function send(chan, message) {
  chan.push("new:msg", {body: "sending message"})
}

export default class Channel {
  constructor(room_name, updateFunction) {
    this.chan = this.connect(room_name, updateFunction)

    this.connect = this.connect.bind(this)
    this.send = this.send.bind(this)
  }


  connect(room_name, updateFunction) {
    socket.connect({})
    const chan = socket.channel(`rooms:${room_name}`, { user })

    // join the channel and listen for admittance
    chan.join()
      .receive('ignore', () => console.log('Access denied.'))
      .receive('ok', () => console.log('Access granted.'))
      .receive('timeout', () => console.log('Must be MongoDB.'))

    // channel-level event handlers
    chan.onError(event => console.log('Channel blew up.'))
    chan.onClose(event => console.log('Channel closed.'))

    //recieve new messages
    //chan.on("new:msg", payload => console.log("new message", payload.body))
    chan.on("new:msg", updateFunction)

    //user entering
    chan.on("new:user", payload => console.log("new user entere", payload.body))

    return chan
  }

  send(message) {
    if (this.chan == null) {
      console.log("channel is negative")
    } else {
      this.chan.push("new:msg", {body: message})

    }
  }



}
