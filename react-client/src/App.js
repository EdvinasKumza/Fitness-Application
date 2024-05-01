import logo from './logo.svg';
import './App.css';
import React from 'react'; 
import TestComponent from './Components/TestComponent.js';
import Navbar from './Components/layout/Navbar';
import Footer from './Components/layout/Footer';
import HomePage from './Components/pages/HomePage';

function App() {
  return (
    <div className="App">
      {/* <TestComponent></TestComponent> */}
      {/* <Navbar /> */}
           <HomePage />
            <Footer />
    </div>
  );
}

export default App;
