import "./App.css";
import React from "react";
import HomePage from "./Components/pages/HomePage";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <HomePage />
      <ToastContainer />
    </div>
  );
}

export default App;
