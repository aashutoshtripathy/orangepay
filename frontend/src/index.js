import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'; 
import 'core-js'

import App from './App'
import store from './store'

// document.addEventListener('contextmenu', (e) => e.preventDefault());

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
   <Router> 
      <App />
    </Router>
  </Provider>
)
