import React, { useState, useEffect } from 'react';
import ProgressGraph from './pages/ProgressGraph';
import { useNavigate } from 'react-router-dom';
import './pages/ProgressComponent.css';
import HeaderComponent from './HeaderComponent';

const ProgressComponent = () => {

    const [goals, setGoals] = useState([]);
    const [sets, setSets] = useState([]);
    const [filteredSets, setFilteredSets] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSets();
        fetchGoals();
        fetchWorkouts();
    }, []);

    useEffect(() => {
        const filtered = sets.filter(set => goals.some(goal => goal.exerciseId === set.exerciseId));
        setFilteredSets(filtered);
    }, [sets, goals]);

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

    const fetchSets = async () => {
        var jwt_token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:5260/api/sets', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt_token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            setSets(data);
        }
    };

    const fetchWorkouts = async () => {
        var jwt_token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:5260/api/workouts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt_token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            setWorkouts(data);
        }
    };

    const goalData = goals.map(goal => {
        const setsForGoal = filteredSets
            .filter(set => set.exerciseId === goal.exerciseId)
            .map((set) => {
                const workout = workouts.find(workout => workout && workout.id === set.workoutId);
                if (!workout) {
                    return null;
                }
                const date = new Date(workout.startDate);
                const month = date.getMonth() + 1; // getMonth() returns month index starting from 0
                const day = date.getDate();
                return {
                    name: `${month}-${day}`,
                    weight: set.weight
                };
            })
            .filter(set => set !== null);

        return { goal, setsForGoal };
    });

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
        <div style={{color: 'green'}}>
            <HeaderComponent />
            <div className='graph-area'>
                <div>
                    <ul>
                        {goalData.map(({ goal, setsForGoal }) => (
                            <li key={goal.exerciseId}>
                                <h2>{goal.type}</h2>
                                <ProgressGraph data={setsForGoal} goal={goal} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ProgressComponent;