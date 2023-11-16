import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Homepage from "./HomePage.jsx";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/home-page" element={<Homepage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
