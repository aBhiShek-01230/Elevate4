import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import "./index.css"
import StudentContextProvider from './context/StudentContext.jsx'
import MessageContextProvider from './context/MessageContext.jsx'
createRoot(document.getElementById('root')).render(
   <BrowserRouter>
   <StudentContextProvider>
    <MessageContextProvider>
    <App />
    </MessageContextProvider>
    </StudentContextProvider>
  </BrowserRouter>
)
