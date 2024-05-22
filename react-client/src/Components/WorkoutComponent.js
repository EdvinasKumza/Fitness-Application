import React, { useState, useEffect } from 'react';

const WorkoutComponent = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutId, setWorkoutId] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [previousWorkouts, setPreviousWorkouts] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    fetchExercises();
    fetchPreviousWorkouts();
  }, []);

  const fetchPreviousWorkouts = async () => {
    var jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5260/api/workouts', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt_token}`
        },
    });
    if(response.ok){
      const data = await response.json();
      setPreviousWorkouts(data);
    }
  };

  const fetchExercises = async () => {
    const response = await fetch('/api/exercises/getexercises');
    const data = await response.json();
    setExercisesList(data);
  };

  const startWorkout = async () => {
    var jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5260/api/workouts/start', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`
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

  const renderWorkoutControls = () => {
    if (isWorkoutActive) {
      return (
        <div>
          <h2>Exercises</h2>
          <select value={selectedExercise?.id} onChange={(e) => setSelectedExercise(exercisesList.find(ex => ex.id === parseInt(e.target.value)))}>
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
        <button onClick={startWorkout}>Start Workout</button>
      );
    }
  };

  const renderPreviousWorkouts = () => {
    return (
      <div>
        <h2>Previous Workouts</h2>
        <ul>
          {previousWorkouts.map((workout) => (
            <li key={workout.id}>
              <strong>{workout.name}</strong> ({workout.type}) - {workout.duration} minutes (
                {workout.exercises && workout.exercises.length} Exercises)
              <br />
              {workout.description && <p>Description: {workout.description}</p>}
              {workout.notes && <p>Notes: {workout.notes}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="workout-tracker">
      {renderWorkoutControls()}
      {renderPreviousWorkouts()}
    </div>
  );
};

const ExerciseList = ({ exercises, onAddExercise }) => {
  // Implement logic to display and allow adding of exercises
  // Consider using a form or input fields for user interaction
  return (
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>{exercise.name}</li>
      ))}
      <li>
        <button onClick={() => onAddExercise({ name: 'New Exercise' })}>
          Add Exercise
        </button>
      </li>
    </ul>
  );
};

export default WorkoutComponent;