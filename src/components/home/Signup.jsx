import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { calendarizeApi } from '../misc/Api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      const user = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      console.log(user);
      const response = await calendarizeApi.signUp(user);
      if (response) {
        setModalTitle('Success');
        setModalMessage('You have successfully signed up!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (e) {
      setModalTitle('Error');
      setModalMessage('An error occurred: ' + e.message);
    } finally {
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-2xl font-semibold mb-6 text-center">Sign up</h3>

        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              name="name"
              onChange={handleChange}
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your name"
              value={formData.name}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email address</label>
            <input
              name="email"
              onChange={handleChange}
              type="email"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter email"
              value={formData.email}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              name="password"
              onChange={handleChange}
              type="password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
              value={formData.password}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Confirm password</label>
            <input
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm password"
              value={formData.confirmPassword}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">Or sign up with:</p>
          <div className="flex justify-center space-x-4 mb-4">
            <a href="#" className="text-gray-900 hover:text-gray-700">
              <FaGithub size={30} />
            </a>
            <a href="#" className="text-red-600 hover:text-red-500">
              <FaGoogle size={30} />
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
            <div className="px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">{modalTitle}</h2>
            </div>
            <div className="px-4 py-3">
              <p>{modalMessage}</p>
            </div>
            <div className="px-4 py-3 border-t text-right">
              <button onClick={handleClose} className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
