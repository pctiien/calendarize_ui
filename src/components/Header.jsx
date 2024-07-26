import 'bootstrap/dist/css/bootstrap.min.css';
import defaultAvt from '../assets/default_avatar.png';
import { Link } from 'react-router-dom';
const Header = (()=>{

    return( 
        <div className=' p-3 d-flex justify-content-between px-5 ' >
            <nav className="d-flex justify-content-around flex-grow-1">
                <Link to="/"  className=' fw-medium text-black text-decoration-none' href="">Me</Link>
                <Link to="/daily" className=' fw-medium text-black text-decoration-none' href="">Daily</Link>
                <Link to="/projects" className=' fw-medium text-black text-decoration-none' href="">Projects</Link>
                <Link to="/" className=' fw-medium text-black text-decoration-none' href="">People</Link>
            </nav>
            <div>
                <img className=' p-1 border border-1 rounded-5' style={{maxWidth:'30px', boxSizing : 'border-box'}} src={defaultAvt} alt="" />
            </div>
        </div>
    )
});

export default Header;