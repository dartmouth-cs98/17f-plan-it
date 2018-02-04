import { Socket } from 'phoenix'

import { updateUsersLive, updateCardsLive } from '../actions'

const user = 'AnonymousCoward'
const timeout = 10000
const URL = 'ws://localhost:4000/socket'
const socket = new Socket(URL, {})

const NUM_TRIES = 10
const heartbeatTimer = 5000;


function logger(payload) {
  console.log("function is not set", payload)
}

class Channel {
  constructor() {
    console.log("Channel has been inited")
    setInterval(() => this.heartbeat(), heartbeatTimer)
    this.cardUpdateHandler = logger;
    this.usersUpdateHandler = logger;
  }

//  constructor(roomName, user_email, updateFunction) {
//    console.log((Math.floor(Math.random()*20)))
//
//    if (((Math.floor(Math.random()*20))%2) == 1) {
//      const email = "sleechie@gmail.com"
//      console.log(email)
//      this.chan = this.connect(roomName, email, updateFunction)
//      setInterval(() => this.heartbeat(email), heartbeatTimer)
//    } else {
//      const email = "sleeinsuk@gmail.com"
//      console.log(email)
//      this.chan = this.connect(roomName, email, updateFunction)
//      setInterval(() => this.heartbeat(email), heartbeatTimer)
//    }
//  }
//
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

    //user entering
    //chan.on("new:user:enter", payload => {
    //  console.log("new user enter", payload.body)
    //  updateUsersLive(payload.body)
    //})

    //handling new messages entering
    this.chan.on("new:msg:cards", payload => {
      console.log("new message arrived", payload)
      //updateCardsLive(payload.cards)
      this.cardUpdateHandler(payload)
    })

    this.chan.on("new:user:heartbeat", payload =>  {
      console.log("heartbeat arrived", payload)
      this.usersUpdateHandler(payload)
    })


  }


  setCardUpdateFunction(func) {
    console.log("new function")
    this.cardUpdateHandler = func;
  }

  setUsersUpdateFunction(func) {
    console.log("new user update function")
    this.usersUpdateHandler = func
  }

  send(message) {
    if (this.chan == null) {
      console.log("Channel is not initalized. Send")
    } else {
      this.chan.push("new:msg:cards", {body: message})
    }
  }

  announceEnter(userName) {
    console.log("announcing enter")
    this.chan.push("new:user:enter", {body: userName})
  }

  heartbeat() {
    if (this.chan == null) {
      console.log("Heartbeat: Channel is not initalized. Beat")
    } else {
      console.log("Heartbeat: I am alive")
      this.chan.push("new:user:heartbeat")
    }

  }
}

export const mainChannel = new Channel()
