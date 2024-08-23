import 'bootstrap/dist/css/bootstrap.min.css';
import defaultAvt from '../assets/default_avatar.png';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const Header = () => {
  return (
    <div className='p-3 d-flex justify-content-between px-5'>
      <nav className="d-flex justify-content-around flex-grow-1">
        <Link to="/" className='fw-medium text-black text-decoration-none'>Me</Link>
        <Link to="/daily" className='fw-medium text-black text-decoration-none'>Daily</Link>
        <Link to="/projects" className='fw-medium text-black text-decoration-none'>Projects</Link>
        <Link to="/" className='fw-medium text-black text-decoration-none'>People</Link>
      </nav>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-avatar" className="border-0 p-0">
          <img
            className='p-1 border border-1 rounded-5'
            style={{ maxWidth: '30px', boxSizing: 'border-box' }}
            src={defaultAvt}
            alt=""
          />
        </Dropdown.Toggle>

        <Dropdown.Menu align="end">
          <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
          <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Header;
