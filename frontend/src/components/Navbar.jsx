import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../actions/user.actions';
import Image from '../styles/assets/img/BanniereBarrode.png';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Détecte le défilement pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser()); 
    navigate('/login');
  };
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };
  
  return (
    <StyledNavbar scrolled={scrolled}>
      <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-logo" onClick={() => handleNavigation('/feed')}>
        <img src={Image} alt="Logo de l'application" className="logo-image" />
        </div>
        
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <button 
            className="navbar-item" 
            onClick={() => handleNavigation('/feed')}
            aria-label="Accueil"
          >
            <svg className="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
            </svg>
            <span className="item-text">Accueil</span>
          </button>
          
          <button 
            className="navbar-item" 
            onClick={() => handleNavigation('/profil')}
            aria-label="Profil"
          >
            <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
            </svg>
            <span className="item-text">Profil</span>
          </button>
          
          <button 
            className="navbar-item" 
            onClick={handleLogout}
            aria-label="Déconnexion"
          >
            <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="item-text">Déconnexion</span>
          </button>
        </div>
        
        <button 
          className="navbar-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Menu"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </div>
    </StyledNavbar>
  );
};

const StyledNavbar = styled.nav`
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
    color: ${props => props.scrolled ? '#333' : '#444'};
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 0 5%;
    height: 70px;
    transition: all 0.3s ease;
    box-shadow: ${props => props.scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
    backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  }

  .navbar-logo {
    cursor: pointer;
    transition: transform 0.2s ease;
    padding: 10px 0;
    display: flex;
    align-items: center;
  }

  .navbar-logo:hover {
    transform: translateY(-2px);
  }
  
  .logo-image {
    height: 40px;
    width: auto;
    object-fit: contain;
  }

  .navbar-menu {
    display: flex;
    gap: 8px;
  }

  .navbar-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .navbar-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }

  .icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  .navbar-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .toggle-line {
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 0 20px;
    }

    .navbar-toggle {
      display: flex;
      z-index: 1001;
    }

    .navbar-menu {
      position: fixed;
      top: 0;
      right: 0;
      flex-direction: column;
      background-color: white;
      height: 100vh;
      width: 250px;
      padding: 80px 20px 20px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .navbar-menu.open {
      transform: translateX(0);
    }

    .navbar-item {
      width: 100%;
      padding: 16px;
      border-radius: 8px;
    }

    .item-text {
      display: inline-block;
      margin-left: 8px;
    }

    .open .toggle-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .open .toggle-line:nth-child(2) {
      opacity: 0;
    }

    .open .toggle-line:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
`;

export default Navbar;