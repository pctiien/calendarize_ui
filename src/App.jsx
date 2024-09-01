import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext'
function App() {
  return (
    <>
      <AuthProvider>
        <Header/>
        <Outlet />
      </AuthProvider>

    </>
  )
}

export default App
