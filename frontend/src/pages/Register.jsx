import React from 'react';
import { Cobe } from '../components/cobeglobe';
import '../styles/home.css'
import '../styles/index.css'
import Image from '../styles/assets/img/BanniereBarrode.png'
import FormRegister from '../components/FormRegister'
import ButtonGoogleRegister from '../components/BouttonGoogleRegister'

const Home = () => {
  return (
    <div className="home-container">
      <img src={Image} alt="Image Headder" className="image-class" />
      <Cobe />
      <FormRegister />
      <FormRegister />
      <ButtonGoogleRegister />
    </div>
  );
};

export default Home;
