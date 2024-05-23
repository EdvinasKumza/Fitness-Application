import React, { useState, useEffect } from 'react';
import HeaderComponent from './HeaderComponent';
import { useNavigate } from 'react-router-dom';

const WorkoutComponent = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutId, setWorkoutId] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [previousWorkouts, setPreviousWorkouts] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchExercises();
    fetchPreviousWorkouts();
  }, []);

  const fetchPreviousWorkouts = async () => {
    var jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5260/api/workouts', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt_token}`,
            'Content-Type': 'application/json',
        },
    });
    if(response.ok){
      const data = await response.json();
      setPreviousWorkouts(data);
    }
  };

  const fetchExercises = async () => {
    const response = await fetch('http://localhost:5260/api/exercises', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setExercisesList(data);
  };

  const startWorkout = async () => {
    var jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5260/api/workouts/start', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setIsWorkoutActive(true);
    setWorkoutId(data.id); // Update state with newly created workout ID
  };

  const addExercise = () => {
    if (!selectedExercise) return;
    setExercises([...exercises, selectedExercise]);
    setSelectedExercise(null);
  };

  const endWorkout = async () => {
    await fetch(`http://localhost:5260/api/workouts/${workoutId}`, { method: 'PUT' });
    setIsWorkoutActive(false);
    setExercises([]); // Clear exercises after ending workout
    window.location.reload();
  };

  const handleRepsChange = (exerciseId, setId, newReps) => {
    // Update the reps value for the specific set within the exercises state
    setExercises((prevState) => {
      const updatedExercises = [...prevState];
      const exerciseIndex = updatedExercises.findIndex((ex) => ex.id === exerciseId);
      const setIndex = updatedExercises[exerciseIndex].sets.findIndex((set) => set.id === setId);
      updatedExercises[exerciseIndex].sets[setIndex].reps = newReps;
      return updatedExercises;
    });
  };
  
  const handleWeightChange = (exerciseId, setId, newWeight) => {
    // Update the weight value for the specific set within the exercises state
    // Similar logic to handleRepsChange
  };
  
  const handleAddSet = (exerciseId) => {
    // Update the exercises state to include a new set object for the exercise
    setExercises((prevState) => {
      const updatedExercises = [...prevState];
      const exerciseIndex = updatedExercises.findIndex((ex) => ex.id === exerciseId);
      if (!updatedExercises[exerciseIndex].sets) {
        updatedExercises[exerciseIndex].sets = [];
      }
      updatedExercises[exerciseIndex].sets.push({ id: Math.random(), setNumber: updatedExercises[exerciseIndex].sets?.length + 1, reps: '', weight: '' });
      return updatedExercises;
    });
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

  const renderWorkoutControls = () => {
    if (isWorkoutActive) {
      return (
        <div className="workout-tracker-area">
          <h2>Exercises</h2>
          <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
            {exercise.name}
            {exercise.sets?.map((set) => (
              <div key={set.id}>
                <span>Set: {set.setNumber}</span>
                <input type="number" min="1" value={set.reps} onChange={(e) => handleRepsChange(exercise.id, set.id, e.target.value)} />
                <input type="number" min="0" value={set.weight} onChange={(e) => handleWeightChange(exercise.id, set.id, e.target.value)} />
              </div>
            ))}
            <button onClick={() => handleAddSet(exercise.id)}>Add Set</button>
          </li>
          ))}
          </ul>
          <select
            value={selectedExercise ? selectedExercise.id : ''}
            onChange={(e) =>
              setSelectedExercise(exercisesList.find(ex => ex.id === parseInt(e.target.value)))
            }
          >
            <option value="">Select Exercise</option>
            {exercisesList.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          <button onClick={addExercise} disabled={!selectedExercise}>
            Add Exercise
          </button>
          <button onClick={endWorkout}>End Workout</button>
        </div>
      );
    } else {
      return (
        <div className="workout-tracker-area">
          <button onClick={startWorkout}>Start Workout</button>
        </div>
      );
    }
  };

  const renderPreviousWorkouts = () => {
    return (
      <div className="workout-tracker-area">
        <h3>Previous Workouts</h3>
        <ul>
          {previousWorkouts.map((workout) => (
            <li key={workout.id}>
              <strong>{workout.name}</strong> ({workout.type}) - {workout.duration} minutes (
              {workout.exercises && workout.exercises.length} Exercises)
              {workout.description && <p>Description: {workout.description}</p>}
              {workout.notes && <p>Notes: {workout.notes}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="workout-tracker" style={{color: 'green'}}>
      <HeaderComponent />
        {renderWorkoutControls()}
        {renderPreviousWorkouts()}
    </div>
  );
};

export default WorkoutComponent;