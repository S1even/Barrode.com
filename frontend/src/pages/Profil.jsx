import React from 'react';
import '../styles/home.css';
import '../styles/index.css';
import UpdateProfil from '../components/Profil/UpdateProfil';
import Navbar from '../components/Navbar';
import Image from '../styles/assets/img/BanniereBarrode.png';
import '../styles/UpdateProfil.css';

const Profil = () => {
  return (
    <div className="home-container">
        <img src={Image} alt="Image Headder" className="image-classPF" />
        <Navbar />
        <UpdateProfil />
    </div>
  );
};

export default Profil;