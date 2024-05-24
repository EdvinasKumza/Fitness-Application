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
    const jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5260/api/workouts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
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
    const jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5260/api/workouts/start', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setIsWorkoutActive(true);
    setWorkoutId(data.id);
  };

  const addExercise = async () => {
    if (!selectedExercise) return;
    const exerciseId = selectedExercise.id;
    console.log(JSON.stringify({ exerciseId }))
    const jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch(`http://localhost:5260/api/workouts/${workoutId}/exercises`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exerciseId }), // Assuming 'selectedExercise' has an 'id' property
    });
  
    if (response.ok) {
      // Exercise successfully added to the workout on the backend
      setExercises([...exercises, { ...selectedExercise, sets: [] }]);
      setSelectedExercise(null);
    } else {
      console.error('Error adding exercise to workout:', await response.text());
      // Handle potential errors from the backend API call
    }
  };

  const endWorkout = async () => {
    await fetch(`http://localhost:5260/api/workouts/${workoutId}`, { method: 'PUT' });
    setIsWorkoutActive(false);
    setExercises([]);
    window.location.reload();
  };

  const handleRepsChange = (exerciseId, setId, newReps) => {
    setExercises((prevState) => {
      const updatedExercises = prevState.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) =>
              set.id === setId ? { ...set, reps: newReps } : set
            ),
          };
        }
        return exercise;
      });
      return updatedExercises;
    });
  };

  const handleWeightChange = (exerciseId, setId, newWeight) => {
    setExercises((prevState) => {
      const updatedExercises = prevState.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) =>
              set.id === setId ? { ...set, weight: newWeight } : set
            ),
          };
        }
        return exercise;
      });
      return updatedExercises;
    });
  };

  const handleAddSet = async (exerciseId) => {
    const set = {
      ExerciseId: exerciseId,
      WorkoutId: workoutId,
      Order: exercises.find(ex => ex.id === exerciseId).sets.length + 1,
      Reps: 0,
      Weight: 0,
      Completed: false,
      RestTime: 0,
      Type: 'Regular',
    };

    const jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5260/api/sets/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(set),
    });

    if (response.ok) {
      const data = await response.json();
      setExercises((prevState) => {
        const updatedExercises = prevState.map((exercise) => {
          if (exercise.id === exerciseId) {
            return { ...exercise, sets: [...exercise.sets, data] };
          }
          return exercise;
        });
        return updatedExercises;
      });
    }
  };

  const handleDeleteSet = async (exerciseId, setId) => {
    const jwt_token = localStorage.getItem('jwtToken');
    const response = await fetch(`http://localhost:5260/api/sets/${setId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setExercises((prevState) => {
        const updatedExercises = prevState.map((exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            };
          }
          return exercise;
        });
        return updatedExercises;
      });
    }
  };

  const handleCompleteSet = (exerciseId, setId) => {
    setExercises((prevState) => {
      const updatedExercises = prevState.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) =>
              set.id === setId ? { ...set, completed: !set.completed } : set
            ),
          };
        }
        return exercise;
      });
      return updatedExercises;
    });

    const set = exercises.find((exercise) => exercise.id === exerciseId).sets.find((set) => set.id === setId);
    saveSetCompletion(set);
  };

  const saveSetCompletion = async (set) => {
    const jwt_token = localStorage.getItem('jwtToken');
    await fetch(`http://localhost:5260/api/sets/${set.id}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: set.completed }),
    });
  };

  const isTokenValid = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;

    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      const exp = decodedPayload.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime < exp;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
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
          {exercises.map((exercise) => (
            <div key={exercise.id} className="exercise">
              <h3>{exercise.name}</h3>
              <div className="sets">
                {exercise.sets.map((set) => (
                  <div key={set.id} className={`set ${set.completed ? 'completed' : ''}`}>
                    <span>Set {set.setNumber}</span>
                    <input
                      type="number"
                      min="1"
                      value={set.reps}
                      onChange={(e) => handleRepsChange(exercise.id, set.id, e.target.value)}
                      placeholder="Reps"
                    />
                    <input
                      type="number"
                      min="0"
                      value={set.weight}
                      onChange={(e) => handleWeightChange(exercise.id, set.id, e.target.value)}
                      placeholder="Weight"
                    />
                    <button onClick={() => handleCompleteSet(exercise.id, set.id)}>
                      ✓
                    </button>
                    <button onClick={() => handleDeleteSet(exercise.id, set.id)}>
                      ✕
                    </button>
                  </div>
                ))}
                <button onClick={() => handleAddSet(exercise.id)} className="add-set">
                  Add Set
                </button>
              </div>
            </div>
          ))}
          <select
            value={selectedExercise ? selectedExercise.id : ''}
            onChange={(e) =>
              setSelectedExercise(exercisesList.find((ex) => ex.id === parseInt(e.target.value)))
            }
          >
            <option value="">Select Exercise</option>
            {exercisesList.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          <button onClick={() => addExercise()} disabled={!selectedExercise}>
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
    <div className="workout-tracker">
      <HeaderComponent />
      {renderWorkoutControls()}
      {renderPreviousWorkouts()}
    </div>
  );
};

export default WorkoutComponent;
