import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <Auth0Provider
  domain={import.meta.env.VITE_AUTH_DOMAIN}
  clientId={import.meta.env.VITE_CLIENT_ID}
  authorizationParams={{
    redirect_uri: window.location.origin
  }}
  >
    <ToastContainer
      position="top-right"
      autoClose={3000}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition:Bounce
    />
    <ToastContainer />
    {console.log(import.meta.env)}
    <App />
  </Auth0Provider>,
)
