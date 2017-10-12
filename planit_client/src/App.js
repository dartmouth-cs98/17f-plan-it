import React, { Component } from 'react'
import './App.css'
import NavBar from './components/nav_bar/index.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        	<NavBar />
        </header>
      </div>
    )
  }
}

export default App
