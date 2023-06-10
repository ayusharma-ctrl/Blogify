import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// sending cookies with every reqest
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
