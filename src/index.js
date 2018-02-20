import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import App from './App'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
//import reducers from './reducers'
import './index.scss'
import registerServiceWorker from './registerServiceWorker';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import rootReducer from './reducers'
import { PersistGate } from 'redux-persist/integration/react'


const persistConfig = {
  key: 'root',
  blacklist: ['trips', 'cards'],
  storage
}


const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer,{}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
))

let persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
, document.getElementById('root'));
registerServiceWorker();
