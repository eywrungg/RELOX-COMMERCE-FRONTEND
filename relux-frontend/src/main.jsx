import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// ===== split CSS (order matters) =====
import './css/base.css'
import './css/header.css'
import './css/sidebars.css'
import './css/intro.css'     // new video section
import './css/hero.css'
import './css/explore.css'
import './css/utilities.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
