import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profil from './pages/Profil';
import Trending from './pages/Trending';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/trending" element={<Trending />} />
    </Routes>
  );
}

export default App;