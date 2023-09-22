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
          <Route path="/" exact element={ <Login />} />
         <Route path="/Signup" element ={ <Signup />} /> 
        </Routes>
      </div>
    </Router>
  );
}
export default App;

