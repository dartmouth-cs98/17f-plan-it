import { Socket } from 'phoenix'

import { updateUsersLive, updateCardsLive } from '../actions'

const user = 'AnonymousCoward'
const timeout = 10000
const URL = 'ws://ec2-34-215-112-24.us-west-2.compute.amazonaws.com/socket'
//const URL = 'ws://plan-it-server.herokuapp.com/socket'
// const URL = 'ws://localhost:4000/socket'
const socket = new Socket(URL, {})

//const heartbeatTimer = 10000; //10 second heartbeat timer
export const heartbeatTimer = 5000; //5 second heartbeat timer


function logger(payload) {
//  console.log("Function is not set", payload)
}

class Channel {
  constructor() {
    this.cardUpdateHandler = logger;
    this.cardDeleteHandler = logger;
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
      this.cardUpdateHandler(payload.cards)
    })

    this.chan.on("new:msg:cards:delete", payload => {
      this.cardDeleteHandler(payload.body)
    })

    this.chan.on("new:user:heartbeat", payload =>  {
      this.usersUpdateHandler(payload)
    })

    setInterval(() => this.heartbeat(), heartbeatTimer)
  }

  setCardFunctions(config) {
    this.cardUpdateHandler = config.update;
    this.cardDeleteHandler = config.delete;
  }

  setUsersUpdateFunction(func) {
    this.usersUpdateHandler = func
  }

  //deprecating
  send(message) {
    if (this.chan == null) {
      console.log("Send: Channel is not initalized.")
    } else {
      this.chan.push("new:msg:cards", {body: message})
    }
  }

  sendCards(message) {
    if (this.chan == null) {
      console.log("Send: Channel is not initalized.")
    } else {
      this.chan.push("new:msg:cards", {body: message})
    }
  }

  deleteCard(id) {
    if (this.chan == null) {
      console.log("Delete: Channel is not initalized.")
    } else {
      this.chan.push("new:msg:cards:delete", {body: id})
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
