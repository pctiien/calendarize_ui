import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Daily from './components/daily/Daily.jsx'
import Projects from './components/projects/Projects.jsx'
import Login from './components/home/Login.jsx'
import Signup from './components/home/Signup.jsx'
import OAuth2Redirect from './components/home/OAuth2Redirect'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="daily" element={<Daily />} />
        <Route path="projects" element={<Projects />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path= "oauth2/callback" element={<OAuth2Redirect />} />
        <Route index element={<Daily />} /> 

      </Route>
    </Routes>
  </BrowserRouter>
);
