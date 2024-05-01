import React, { useState, useEffect } from 'react';

const WorkoutTracker = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutId, setWorkoutId] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [previousWorkouts, setPreviousWorkouts] = useState([]);

  useEffect(() => {
    // Fetch previous workouts on component mount
    fetchPreviousWorkouts();
  }, []);

  const fetchPreviousWorkouts = async () => {
    const response = await fetch('http://localhost:5260/api/workouts');
    const data = await response.json();
    setPreviousWorkouts(data);
  };

  const startWorkout = async () => {
    const response = await fetch('http://localhost:5260/api/workouts/start', { method: 'POST' });
    const data = await response.json();
    setIsWorkoutActive(true);
    setWorkoutId(data.id); // Update state with newly created workout ID
  };

  const addExercise = (exercise) => {
    // Implement logic to send a POST request with exercise details to the backend API
    // Update the exercises state locally as well (for immediate UI update)
    setExercises([...exercises, exercise]);
  };

  const endWorkout = async () => {
    await fetch(`http://localhost:5260/api/workouts/${workoutId}`, { method: 'PUT' });
    setIsWorkoutActive(false);
    setExercises([]); // Clear exercises after ending workout
  };

  const renderWorkoutControls = () => {
    if (isWorkoutActive) {
      return (
        <div>
          <h2>Exercises</h2>
          <ExerciseList exercises={exercises} onAddExercise={addExercise} />
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
              {workout.startTime.toLocaleString()} - {workout.duration} minutes
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

export default WorkoutTracker;