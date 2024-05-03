import logo from "./logo.svg";
import "./App.css";
import React, {useState}from "react";
import TestComponent from "./Components/TestComponent.js";
// import Navbar from "./Components/layout/Navbar";
// import Footer from "./Components/layout/Footer";
import HomePage from "./Components/pages/HomePage";
import LogInModal from "./Components/pages/LogInModal.js";
import UserContext from "./Components/UserContext.js";

function App() {
  const [userData, setUserData] = useState(null);

  return (
    <div className="App">
      {/* <TestComponent></TestComponent> */}
      {/* <Navbar /> */}
      <UserContext.Provider value={{ userData, setUserData }}>
        <HomePage />
      </UserContext.Provider>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
