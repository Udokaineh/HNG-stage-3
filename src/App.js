import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"

function App() {
  return (
    <Router>
      <div>
        <Routes>
         <Route path="/" exact element ={ <Signup />} /> 
          <Route path="/Login" element={ <Login />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;

