import React from 'react';
import {Link} from 'react-router-dom'
const NavBar = () => {
    return (
        <div className='nav'>
            <div className='logo'>
                <Link className='nav-link' to="/">Codegrid</Link>
            </div>
            <div className='nav-links'>
                <div className="nav-item">
                    <Link className='nav-link' to="/">
                        Home
                    </Link>
                </div>
                <div className="nav-item">
                    <Link className='nav-link' to="/About">
                        About
                    </Link>
                </div>
                <div className="nav-item">
                    <Link className='nav-link' to="/Contact">
                        Contact
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NavBar;