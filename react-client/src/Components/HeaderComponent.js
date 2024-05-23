import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderComponent.css';

const HeaderComponent = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const name = localStorage.getItem('name');

    const handleHomeButton = () => {
        navigate('/');
    };
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    
    const handleGoalsButton = () => {
        navigate('/goals');
    };
    
    const handleWorkoutsButton = () => {
        navigate('/workouts');
    };
    
    const handleProgressButton = () => {
        navigate('/progress');
    };
    
    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('name');
        setDropdownOpen(false);
        navigate('/');
        window.location.reload();
    };

    return (
        <div>
            <nav className="navbar">
                <img src="/logo192.png" alt="Logo" className="navbar-logo" />
                <ul className="navbar-links">
                    <li>
                        <button onClick={handleHomeButton}>Home</button>
                    </li>
                    <li>
                        <a href="#services">Services</a>
                    </li>
                    <li>
                        <a href="#about">About</a>
                    </li>
                </ul>
                <div>
                    <div>
                        <button className="dropbtn" onClick={toggleDropdown}>
                            {name}
                        </button>
                        {dropdownOpen && (
                            <div id="myDropdown" className="dropdown-content">
                                <button onClick={handleWorkoutsButton}>
                                    Workouts
                                </button>
                                <button onClick={handleGoalsButton}>
                                    Goals
                                </button>
                                <button onClick={handleProgressButton}>
                                    Progress
                                </button>
                                <button onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                    
                </div>
            </nav>
        </div>
    );
};

export default HeaderComponent;