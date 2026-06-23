import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from './context/NotificationContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NotificationProvider>
      <StrictMode>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </StrictMode>
    </NotificationProvider>
  </BrowserRouter>
)
