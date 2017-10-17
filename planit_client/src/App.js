import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Workspace from './components/workspace/index.js'
import Onboarding from './components/onboarding/index.js'

class App extends Component {
  render() {
    return (
      <div className='App'>
          <Router>
              <Switch>
                <Route exact path='/' component={Onboarding} />
                <Route path='/workspace' component={Workspace}/>
                <Route render={() => (<div>post not found </div>)} />
              </Switch>
          </Router>
      </div>
    )
  }
}

export default App
