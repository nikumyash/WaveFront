import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {store}  from './store.js'
import { Provider } from 'react-redux'
import { setupAxios } from './utils/axios.js'

setupAxios(store);
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
        <App />
    {/* </React.StrictMode>, */}
  </Provider>  
)
