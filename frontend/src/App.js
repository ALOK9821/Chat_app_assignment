import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [authToken, setAuthToken] = useState(null);

  return (
    <div className="App">
      {!authToken ? (
        <>
          <Register />
          <Login setAuthToken={setAuthToken} />
        </>
      ) : (
        <Chat authToken={authToken} />
      )}
    </div>
  );
}

export default App;
