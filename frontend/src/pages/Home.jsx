import React from 'react';
import { Cobe } from '../components/cobeglobe';
import '../styles/home.css';
import Image from '../styles/assets/img/BanniereBarrode.png';
import Form from '../components/Form';


const Home = () => {
  return (
    <div className="home-containerHome">
      <img src={Image} alt="Image Headder" className="image-class" />
      <Cobe />
      <Form />
    </div>
  );
};

export default Home;
