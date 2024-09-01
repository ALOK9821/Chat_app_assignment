import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  return (
    <div className="App">
      {!authToken ? (
        <>
          <Register />
          <Login setAuthToken={setAuthToken} />
        </>
      ) : (
        <Chat authToken={authToken} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
