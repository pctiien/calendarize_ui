import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="border p-4 rounded shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="mb-4 text-center">Sign up</h3>

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" placeholder="Enter email" />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="Password" />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm password</label>
          <input type="password" className="form-control" placeholder="Confirm password" />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">Sign up</button>

        <div className="text-center">
          <p className="mb-1">Or sign up with:</p>
          <div className="d-flex justify-content-center mb-3">
            <a href="#" className="text-dark mx-2">
              <FaGithub size={30} />
            </a>
            <a href="#" className="text-danger mx-2">
              <FaGoogle size={30} />
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-0">
            Already had an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
