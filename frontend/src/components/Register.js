import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local/register', {
        username,
        email,
        password,
      });
      console.log('User registered:', response.data);
      setMessage('Registration successful! You can now log in.');
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
