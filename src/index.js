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
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

  let store = createStore(persistedReducer,{}, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ))
  let persistor = persistStore(store)

// this creates the store with the reducers, and does some other stuff to initialize devtools
// const store = createStore(reducers, {}, compose(
//   applyMiddleware(thunk),
//   window.devToolsExtension ? window.devToolsExtension() : f => f,
// ));
// const token = localStorage.getItem('token');
// if (token) {
//   store.dispatch({ type: ActionTypes.AUTH_USER });
// }

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
, document.getElementById('root'));
registerServiceWorker();
