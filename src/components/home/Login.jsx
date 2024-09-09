import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { calendarizeApi } from '../misc/Api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { parseJwt } from '../misc/Helpers';
import { getSocialLogin } from '../misc/Helpers';

const Login = () => {
  const Auth = useAuth();
  const navigate = useNavigate(); // Khởi tạo hook useNavigate
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('email :' + formData.email);
    console.log('password :' + formData.password);
    try {
      const response = await calendarizeApi.authenticate(formData.email, formData.password);
      if (response && response.data) {
        const token = response.data;
        const data = parseJwt(token.accessToken);
        const authenticatedUser = { data, token };
        console.log('user', authenticatedUser);
        Auth.userLogin(authenticatedUser);
        navigate('/');
      }
    } catch (e) {
      console.log('error: ' + e.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-2xl font-semibold mb-6 text-center">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email address</label>
            <input
              name="email"
              onChange={handleChange}
              type="email"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              name="password"
              onChange={handleChange}
              type="password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">Or login with:</p>
          <div className="flex justify-center space-x-4 mb-4">
            <a href={getSocialLogin('github')} className="text-gray-900 hover:text-gray-700">
              <FaGithub size={30} />
            </a>
            <a href={getSocialLogin('google')} className="text-red-600 hover:text-red-500">
              <FaGoogle size={30} />
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
