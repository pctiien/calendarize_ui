import 'bootstrap/dist/css/bootstrap.min.css';
import defaultAvt from '../assets/default_avatar.png';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import teamProject from '../assets/group-chat.png';
import checkList from '../assets/checklist.png';
import netWork from '../assets/network.png';
import { useState } from 'react';
import './Header.css'; // Import CSS file

const Header = () => {
  const [activeItem, setActiveItem] = useState('');

  const handleClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div
      className="d-flex flex-column align-items-center bg-black py-3 px-2 rounded-2 mx-1"
      style={{ width: '45px', height: '99vh', position: 'fixed' }}
    >
      <nav className="d-flex flex-column flex-grow-1 justify-content-start align-items-center position-relative">
        <Link
          to="/daily"
          className={`nav-item mb-4 position-relative ${activeItem === 'daily' ? 'active' : ''}`}
          onClick={() => handleClick('daily')}
        >
          <img
            src={checkList}
            alt="Daily"
            style={{ width: '30px', height: '30px' }}
          />
          {activeItem === 'daily' && (
            <div className="overlay" />
          )}
        </Link>
        <Link
          to="/projects"
          className={`nav-item mb-4 position-relative ${activeItem === 'projects' ? 'active' : ''}`}
          onClick={() => handleClick('projects')}
        >
          <img
            src={teamProject}
            alt="Projects"
            style={{ width: '30px', height: '30px' }}
          />
          {activeItem === 'projects' && (
            <div className="overlay" />
          )}
        </Link>
        <Link
          to="/"
          className={`nav-item mb-4 position-relative ${activeItem === 'network' ? 'active' : ''}`}
          onClick={() => handleClick('network')}
        >
          <img
            src={netWork}
            alt="Network"
            style={{ width: '30px', height: '30px' }}
          />
          {activeItem === 'network' && (
            <div className="overlay" />
          )}
        </Link>
      </nav>

      <Dropdown>
        <Dropdown.Toggle
          variant="normal"
          id="dropdown-avatar"
          className="p-0 border-0"
        >
          <img
            src={defaultAvt}
            alt="Avatar"
            className="rounded-circle"
            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu align="end">
          <Dropdown.Item as={Link} to="/login">
            Login
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/signup">
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Header;
