import 'bootstrap/dist/css/bootstrap.min.css';
import { Link,useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import {calendarizeApi} from '../misc/Api'
import {useAuth} from '../context/AuthContext'
import {useState,Navigate} from 'react'
import {parseJwt} from '../misc/Helpers'
import { getSocialLogin } from '../misc/Helpers';
const Login = () => {
  const Auth = useAuth()
  const navigate = useNavigate(); // Khởi tạo hook useNavigate
  const [formData,setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setFormData((prev)=>({...prev, [name]:value}))
  }
 
  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log('email :' + formData.email)
    console.log('password :' + formData.password)
    try{
      const response =await calendarizeApi.authenticate(formData.email,formData.password)
      if(response && response.data)
      {
        const token = response.data
        const data = parseJwt(token.accessToken)
        console.log('data',data)
        const authenticatedUser = {data,token}
        console.log('user',authenticatedUser)
        Auth.userLogin(authenticatedUser)
      
        navigate('/');

      }
    }catch(e){
      console.log('error: ' +e.message)
    }
  
  }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="border p-4 rounded shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="mb-4 text-center">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input name = "email" onChange={handleChange} type="email" className="form-control" placeholder="Enter email" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name = "password" onChange={handleChange} type="password" className="form-control" placeholder="Password" />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>

        </form>
        <div className="text-center">
          <p className="mb-1">Or login with:</p>
          <div className="d-flex justify-content-center mb-3">
            <a href={getSocialLogin('github')} className="text-dark mx-2">
              <FaGithub size={30} />
            </a>
            <a href="#" className="text-danger mx-2">
              <FaGoogle size={30} />
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-0">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
