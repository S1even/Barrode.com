import React from 'react';
import '../styles/home.css';
import '../styles/index.css';
import Navbar from '../components/Navbar';
import Image from '../styles/assets/img/BanniereBarrode.png';

const Feed = () => {
  return (
    <div className="home-container">
      <Navbar />
      <img src={Image} alt="Image Headder" className="image-classPF" />
    </div>
  );
};

export default Feed;
