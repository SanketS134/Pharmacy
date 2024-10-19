import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';

// Import components for different pages
import Pharmacy from './components/Pharmacy';
import Inventory from './components/Inventory';
import Prescription from './components/Prescription';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <div className="nav-container">
            <h1 className="nav-logo">PharmaCare</h1>
            <ul>
              <li><Link to="/">Pharmacy</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/prescription">Prescription</Link></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Pharmacy />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/prescription" element={<Prescription />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
