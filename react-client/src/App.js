import "./App.css";
import React from "react";
import HomePage from "./Components/pages/HomePage";
import { ToastContainer } from 'react-toastify';
import WorkoutPage from "./Components/pages/WorkoutPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoalsComponent from "./Components/GoalsComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProgressComponent from "./Components/ProgressComponent";

function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/workouts" element={<WorkoutPage />} />
                <Route path="/goals" element={<GoalsComponent/>} />
                <Route path="/progress" element={<ProgressComponent />} />
            </Routes>
        </Router>
        <ToastContainer />
        <FontAwesomeIcon />
    </div>
  );
}

export default App;
