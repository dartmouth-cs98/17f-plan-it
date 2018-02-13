import { Socket } from 'phoenix'

import { updateUsersLive, updateCardsLive } from '../actions'

const user = 'AnonymousCoward'
const timeout = 10000
const URL = 'ws://localhost:4000/socket'
const socket = new Socket(URL, {})

//const heartbeatTimer = 10000; //10 second heartbeat timer
export const heartbeatTimer = 5000; //5 second heartbeat timer


function logger(payload) {
  console.log("Function is not set", payload)
}

class Channel {
  constructor() {
    setInterval(() => this.heartbeat(), heartbeatTimer)
    this.cardUpdateHandler = logger;
    this.usersUpdateHandler = logger;
  }

  connect(roomName, email) {
    socket.connect({})
    const chan = socket.channel(`rooms:${roomName}`, { email })
    this.chan = chan;

    // join the channel and listen for admittance
    chan.join()
      .receive('ignore', () => console.log('Channel access denied.'))
      .receive('ok', () => console.log('Channel access granted'))
      .receive('timeout', () => console.log('Channel timed out.'))

    // channel-level event handlers
    chan.onError(event => console.log(event, 'Channel errored out.'))
    chan.onClose(event => console.log('Channel closed.'))

    //handling new messages entering
    this.chan.on("new:msg:cards", payload => {
      console.log("new message arrived", payload)
      //updateCardsLive(payload.cards)
      this.cardUpdateHandler(payload)
    })

    this.chan.on("new:user:heartbeat", payload =>  {
      this.usersUpdateHandler(payload)
    })
  }

  setCardUpdateFunction(func) {
    this.cardUpdateHandler = func;
  }

  setUsersUpdateFunction(func) {
    this.usersUpdateHandler = func
  }

  send(message) {
    if (this.chan == null) {
      console.log("Send: Channel is not initalized.")
    } else {
      this.chan.push("new:msg:cards", {body: message})
    }
  }

  announceEnter(userName) {
    this.chan.push("new:user:enter", {body: userName})
  }

  heartbeat() {
    if (this.chan == null) {
      console.log("Heartbeat: Channel is not initalized.")
    } else {
      this.chan.push("new:user:heartbeat")
    }

  }
}

export const mainChannel = new Channel()
