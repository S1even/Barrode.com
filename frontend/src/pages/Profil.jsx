import React from 'react';
import '../styles/home.css';
import '../styles/index.css';
import UpdateProfil from '../components/Profil/UpdateProfil';
import Navbar from '../components/Navbar';
import '../styles/UpdateProfil.css';

const Profil = () => {
  return (
    <div className="home-container">
        <Navbar />
        <UpdateProfil />
    </div>
  );
};

export default Profil;