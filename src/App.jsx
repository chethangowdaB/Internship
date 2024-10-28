import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ChatInterface from './Components/Chat';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/chat/:userId" element={user ? <ChatInterface user={user} /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
