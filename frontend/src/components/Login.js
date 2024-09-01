import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuthToken }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier,
        password,
      });
      console.log('User logged in:', response.data);

      const { jwt } = response.data;
      setAuthToken(jwt);
      localStorage.setItem('authToken', jwt); // Store JWT in Local Storage

      setMessage('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
