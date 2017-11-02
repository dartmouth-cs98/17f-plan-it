import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Workspace from './components/workspace/index.js'
import Onboarding from './components/onboarding/index.js'
import Dashboard from './components/dashboard/index.js'
import Explore from './components/explore/index.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './App.scss'

class App extends Component {
  render() {
    return (
      <div className='App'>
        <MuiThemeProvider>
          <Router>
              <Switch>
                <Route exact path='/' component={Onboarding} />
                <Route path="/workspace/:workspaceID" component={Workspace}/>
                <Route path="/workspace" component={Workspace}/>
                <Route path='/explore' component={Explore}/>
                <Route path='/dashboard' component={Dashboard}/>
                <Route render={() => (<div>post not found </div>)} />
              </Switch>
          </Router>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App
