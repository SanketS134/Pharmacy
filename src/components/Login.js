import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login({onLogin}) {
    const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    // Import useNavigate hook

    // Get the navigate function

    // Add this inside the handleSubmit function
    // For now, we'll assume the login is successful
    if (username && password) {
      // Navigate to the inventory page
      onLogin();
      navigate('/inventory');
    } else {
      // Handle login failure (you might want to show an error message)
      console.log('Login failed: Please enter both username and password');
    }
    console.log('Login attempted with:', username, password);
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <img src="pharma-login.png" alt="Pharmacy" className="login-background-image" />
      </div>
      <div className="login-right-panel">
        <div className="login-box">
          <img src="logo.png" alt="Pharmacy Logo" className="login-logo" />
          <h2>Pharmacy Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="login-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="login-forgot-password"><a href="#">Forgot Password?</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
