import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from './AuthContext';

// Import components for different pages
// import Pharmacy from "./components/Pharmacy";
import Inventory from "./components/Inventory";
// import Prescription from "./components/Prescription";
import Login from "./components/Login";
import Home from "./components/Home";
import PlaceOrderPage from "./components/PlaceOrderPage";
import PharmacyPage from "./components/PharmacyPage";
import Orders from "./components/Orders";
import PrescriptionTable from "./components/prescription_table";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const showNav = isLoggedIn && location.pathname !== "/login";

  return (
    <div className="App">
      {showNav && (
        <nav className="App-nav" style={{ backgroundColor: '#091057' }}>
          <div className="nav-container">
            <h1 className="nav-logo">PharmaCare</h1>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/prescription">Prescription</Link></li>
              <li><Link to="/pharmacy">Pharmacy</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/inventory" element={isLoggedIn ? <Inventory /> : <Navigate to="/login" />} />
        <Route path="/prescription" element={isLoggedIn ? <PrescriptionTable /> : <Navigate to="/login" />} />
        <Route path="/pharmacy" element={isLoggedIn ? <PharmacyPage /> : <Navigate to="/login" />} />
        <Route path="/place-order" element={isLoggedIn ? <PlaceOrderPage /> : <Navigate to="/login" />} />
        <Route path="/orders" element={isLoggedIn ? <Orders /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
