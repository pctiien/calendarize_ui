import 'bootstrap/dist/css/bootstrap.min.css';
import defaultAvt from '../assets/default_avatar.png';
const Header = (()=>{

    return( 
        <div className=' p-3 d-flex justify-content-between px-5 ' >
            <nav className="d-flex justify-content-around flex-grow-1">
                <a className=' fw-medium text-black text-decoration-none' href="">Me</a>
                <a className=' fw-medium text-black text-decoration-none' href="">Daily</a>
                <a className=' fw-medium text-black text-decoration-none' href="">Projects</a>
                <a className=' fw-medium text-black text-decoration-none' href="">People</a>
            </nav>
            <div>
                <img className=' p-1 border border-1 rounded-5' style={{maxWidth:'30px', boxSizing : 'border-box'}} src={defaultAvt} alt="" />
            </div>
        </div>
    )
});

export default Header;