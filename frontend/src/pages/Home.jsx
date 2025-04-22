import React from 'react';
import { Cobe } from '../components/cobeglobe';
import '../styles/home.css';
import '../styles/index.css';
import Image from '../styles/assets/img/BanniereBarrode.png';
import Form from '../components/Form';
import ButtonGoogle from '../components/ButtonGoogle';


const Home = () => {
  return (
    <div className="home-containerHome">
      <img src={Image} alt="Image Headder" className="image-class" />
      <Cobe />
      <Form />
      <ButtonGoogle />
    </div>
  );
};

export default Home;
