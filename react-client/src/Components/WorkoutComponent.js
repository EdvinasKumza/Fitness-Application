import React, { useState, useEffect, useCallback } from 'react';
import HeaderComponent from './HeaderComponent';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

const WorkoutComponent = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutId, setWorkoutId] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [previousWorkouts, setPreviousWorkouts] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
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

  const debouncedSaveSetChanges = useCallback(
    debounce(async (setId, changes) => {
      const jwt_token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:5260/api/sets/${setId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        console.error('Error updating set:', await response.text());
        // Handle potential errors from the backend API call
      }
    }, 300), [] // 500ms delay
  );

  const handleSetChange = (exerciseId, setId, changes) => {
    setExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise, // Spread the entire exercise object
              sets: exercise.sets.map((set) => (set.id === setId ? { ...set, ...changes } : set)),
            }
          : exercise
      )
    );
    debouncedSaveSetChanges(setId, changes); // Pass the changes directly
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
    console.log(setId);
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
                      onChange={(e) => {
                        if(e.target.value === '') { e.target.value = 0; }
                        handleSetChange(exercise.id, set.id, { reps: e.target.value })
                      }}
                      placeholder="Reps"
                    />
                    <input
                      type="number"
                      min="0"
                      value={set.weight}
                      onChange={(e) => {
                        if(e.target.value === '') { e.target.value = 0; }
                        handleSetChange(exercise.id, set.id, { weight: e.target.value })
                      }}
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

  const toggleWorkoutExpansion = (workoutId) => {
    setExpandedWorkouts((prevState) => ({
      ...prevState,
      [workoutId]: !prevState[workoutId],
    }));
  };

  const renderPreviousWorkouts = () => {
    return (
      <div className="workout-tracker-area">
        <h3>Previous Workouts</h3>
        <ul>
          {previousWorkouts && previousWorkouts.length > 0 ? (
            previousWorkouts.map((workout) => (
              <li key={workout.id}>
                <div onClick={() => toggleWorkoutExpansion(workout.id)}>
                  <strong>{workout.name}</strong> ({workout.type}) - {workout.duration} minutes (
                  {workout.workoutExerciseOrders && workout.workoutExerciseOrders.length} Exercises)
                  {workout.description && <p>Description: {workout.description}</p>}
                  {workout.notes && <p>Notes: {workout.notes}</p>}
                </div>
                {expandedWorkouts[workout.id] && workout.workoutExerciseOrders && (
                  <ul>
                    {workout.workoutExerciseOrders.map((weo) => (
                      <li key={weo.id}>
                        <strong>{weo.exercise.name}</strong>
                        <ul>
                          {workout.sets
                            .filter((set) => set.exerciseId === weo.exercise.id)
                            .map((set) => (
                              <li key={set.id}>
                                Reps: {set.reps}, Weight: {set.weight}, Completed: {set.completed ? 'Yes' : 'No'}
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <li>No previous workouts available</li>
          )}
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
