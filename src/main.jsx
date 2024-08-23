import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Daily from './components/Daily.jsx'
import Projects from './components/Projects.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="daily" element={<Daily />} />
        <Route path="projects" element={<Projects />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route index element={<Daily />} /> {/* Trang chính */}

      </Route>
    </Routes>
  </BrowserRouter>
);
