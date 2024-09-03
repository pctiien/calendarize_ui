import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { calendarizeApi } from '../misc/Api';
import { Modal, Button } from 'react-bootstrap';

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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="border p-4 rounded shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="mb-4 text-center">Sign up</h3>

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              onChange={handleChange}
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              name="email"
              onChange={handleChange}
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              onChange={handleChange}
              type="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm password</label>
            <input
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              className="form-control"
              placeholder="Confirm password"
              value={formData.confirmPassword}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Sign up</button>
        </form>

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
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Signup;
