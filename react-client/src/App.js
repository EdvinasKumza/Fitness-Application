import "./App.css";
import React from "react";
import HomePage from "./Components/pages/HomePage";
import { ToastContainer } from 'react-toastify';
import WorkoutPage from "./Components/pages/WorkoutPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/workouts" element={<WorkoutPage />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
