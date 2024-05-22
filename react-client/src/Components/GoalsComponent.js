import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './pages/GoalsPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const GoalsComponent = () => {
    const [exercise, setExercise] = useState('');
    const [value, setValue] = useState('');
    const [goals, setGoals] = useState([]);
    const [exercisesList, setExercisesList] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExercises();
        fetchGoals();
    }, []);

    const fetchExercises = async () => {
        const response = await fetch('/api/exercises/getexercises');
        const data = await response.json();
        setExercisesList(data);
    };

    const fetchGoals = async () => {
        var jwt_token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:5260/api/goals', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt_token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            setGoals(data);
        }
    };

    const handleExerciseChange = (event) => {
        setExercise(event.target.value);
    };

    const handleValueChange = (event) => {
        setValue(event.target.value);
    };

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

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('name');
        setDropdownOpen(false);
        navigate('/');
        window.location.reload();
    };

    const handleSetGoal = async () => {
        var jwt_token = localStorage.getItem('jwtToken');
        const requestBody = JSON.stringify({
            Type: exercise,
            Target: parseInt(value, 10)
        });
        if (exercise && value) {
            console.log(`Selected exercise: ${exercise}, Value: ${value}`);
            const response = await fetch('http://localhost:5260/api/goals/set', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt_token}`,
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log('Goal set successfully:', responseData);
                fetchGoals();
            } else {
                console.error('Failed to set goal:', response.status);
                toast.error("Failed to set goal. Please try again.");
            }
        } else {
            toast.info("Please select an exercise and set a value.");
        }
    };

    const handleDeleteGoal = async (goalId) => {
        var jwt_token = localStorage.getItem('jwtToken');
        const response = await fetch(`http://localhost:5260/api/goals/${goalId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt_token}`
            }
        });
        if (response.ok) {
            fetchGoals();
        } else {
            toast.error("Failed to delete goal. Please try again.");
        }
    };

    const isTokenValid = () => {
        // Get the token from localStorage
        const token = localStorage.getItem('jwtToken');

        // Return false if no token is found
        if (!token) return false;

        try {
            // Decode the token payload
            const base64Payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(base64Payload));

            // Check the expiration time
            const exp = decodedPayload.exp;
            const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

            return currentTime < exp; // Check if the current time is less than the expiration time
        } catch (error) {
            console.error('Invalid token:', error);
            return false; // Token is invalid
        }
    };

    const tokenValid = isTokenValid();
    const name = localStorage.getItem('name');

    if (!tokenValid) {
        navigate('/');
        return null;
    }

    return (
        <div className="main-content">
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
                                <button onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                    
                </div>
            </nav>

            <div className='goal-setting-area'>
                <div>
                    <label htmlFor="exercise" >Exercise:</label>
                    <select id="exercise" value={exercise} onChange={handleExerciseChange}>
                        <option value="">Select Exercise</option>
                        <option value="THIS IS FOR TEST1">THIS IS FOR TEST1</option>
                        <option value="THIS IS FOR TEST2">THIS IS FOR TEST2</option>
                        <option value="THIS IS FOR TEST3">THIS IS FOR TEST3</option>
                        <option value="THIS IS FOR TEST4">THIS IS FOR TEST4</option>
                        <option value="THIS IS FOR TEST5">THIS IS FOR TEST5</option>
                        <option value="THIS IS FOR TEST6">THIS IS FOR TEST6</option>
                        {exercisesList.map((exercise) => (
                            <option key={exercise.id} value={exercise.id}>
                                {exercise.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div >
                    <label htmlFor="value" >Weight (kg):</label>
                    <input type="number" id="value" value={value} onChange={handleValueChange} />
                </div>

                <button onClick={handleSetGoal} id='set-goal'>
                    Set Goal
                </button>

                {goals.length > 0 && (
                    <div >
                        <h3>Set Goals:</h3>
                        <ul>
                            {goals.map((goal) => (
                                <li key={goal.id}>
                                    <strong>{goal.type}</strong> - {goal.target} kg
                                    <button onClick={() => handleDeleteGoal(goal.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalsComponent;