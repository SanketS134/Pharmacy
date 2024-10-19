import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// Import components for different pages
import Pharmacy from './components/Pharmacy';
import Inventory from './components/Inventory';
import Prescription from './components/Prescription';
import Login from './components/Login';
import Home from './components/Home';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username) => {
    // Here you would typically validate the login
    // For this example, we'll just set isLoggedIn to true
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && (
          <nav className="App-nav">
            <div className="nav-container">
              <h1 className="nav-logo">PharmaCare</h1>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/inventory">Inventory</Link></li>
                <li><Link to="/prescription">Prescription</Link></li>
                <li><Link to="/pharmacy">Pharmacy</Link></li>                
              </ul>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Pharmacy />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
