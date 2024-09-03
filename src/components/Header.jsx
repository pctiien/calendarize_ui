import defaultAvt from '../assets/default_avatar.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css'; // Import CSS mới
import checkList from '../assets/checklist.png';
import teamProject from '../assets/group-chat.png';
import netWork from '../assets/network.png';

const Header = () => {
  const [activeItem, setActiveItem] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className="flex flex-col items-center py-3 mx-2 rounded"
      style={{ width: '45px', height: '95vh', position: 'fixed', backgroundColor: '#202046' }}
    >
      <nav className="flex flex-col flex-grow justify-start items-center relative">
        <Link
          to="/daily"
          className={`nav-item ${activeItem === 'daily' ? 'active' : ''}`}
          onClick={() => handleClick('daily')}
        >
          <img
            src={checkList}
            alt="Daily"
          />
        </Link>
        <Link
          to="/projects"
          className={`nav-item ${activeItem === 'projects' ? 'active' : ''}`}
          onClick={() => handleClick('projects')}
        >
          <img
            src={teamProject}
            alt="Projects"
          />
        </Link>
        <Link
          to="/"
          className={`nav-item ${activeItem === 'network' ? 'active' : ''}`}
          onClick={() => handleClick('network')}
        >
          <img
            src={netWork}
            alt="Network"
          />
        </Link>
      </nav>

      <div className="relative mt-auto">
        <button
          className="p-0 border-0 focus:outline-none"
          onClick={toggleDropdown}
        >
          <img
            src={defaultAvt}
            alt="Avatar"
            className="rounded-full w-7 h-7 object-cover"
          />
        </button>
        {isDropdownOpen && (
          <div className="dropdown">
            <Link to="/login" onClick={toggleDropdown} className="dropdown-link">Login</Link>
            <Link to="/" onClick={toggleDropdown} className="dropdown-link">Logout</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
