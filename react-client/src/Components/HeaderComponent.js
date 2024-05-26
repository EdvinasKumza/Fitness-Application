import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderComponent.css";
import userImage from "../assets/images/user.png";
const HeaderComponent = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const name = localStorage.getItem("name");

  const handleHomeButton = () => {
    navigate("/");
  };
  const handleServiceButton = () => {
    navigate("/");
    window.location.hash = "#services";
  };

  const handleCalendarButton = () => {
    navigate("/calendar");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleGoalsButton = () => {
    navigate("/goals");
  };

  const handleWorkoutsButton = () => {
    navigate("/workouts");
  };

  const handleProgressButton = () => {
    navigate("/progress");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    setDropdownOpen(false);
    navigate("/");
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
            <button onClick={handleServiceButton}>Services</button>
          </li>
        </ul>
        <div>
          <div>
            <button className="dropbtn" onClick={toggleDropdown}>
              {/* {name} */}
              {/* <a> */}
              <img src={userImage} width="25px" height="25px"></img>
              Paskyra
              {/* </a> */}
            </button>
            {dropdownOpen && (
              <div id="myDropdown" className="dropdown-content">
                <a className="dropdown-item-first">Sveiki, {name}</a>
                <button onClick={handleWorkoutsButton}>Workouts</button>
                <button onClick={handleGoalsButton}>Goals</button>
                <button onClick={handleProgressButton}>Progress</button>
                <button onClick={handleCalendarButton}>Calendar</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HeaderComponent;
