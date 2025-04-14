import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register'
import Feed from './pages/Feed'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />

      </Routes>
    </Router>
  );
}

export default App;
