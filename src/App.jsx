import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext'
import OAuth2Redirect from './components/home/OAuth2Redirect';
import './index.css';

function App() {
  return (
    <>
      <AuthProvider>
        <Header/>
        <Outlet />
        <OAuth2Redirect/>
      </AuthProvider>

    </>
  )
}

export default App
