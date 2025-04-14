import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook initialisation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log('Connexion réussie :', response.data);

      // Feed redirection
      navigate('/feed');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage(error.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <StyledWrapper>
    <div className="form-container">
      <p className="title">S'identifer</p>
      <form className="form" onSubmit={handleSubmit}>
        {/* E-mail */}
        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="sign" type="submit">
          Se connecter
        </button>
        
        {/* Error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>

      <div className="social-message">
        <div className="line" />
        <p className="message">Ou</p>
        <div className="line" />
      </div>
      <p className="signup">
        Vous ne possédez pas de compte ?
        <a rel="noopener noreferrer" href="/register" className="link"> Crée un compte</a>
      </p>
    </div>
  </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form-container {
    position: absolute;
    bottom: 230px;
    right: 500px;
    height: 450px;
    width: 380px;
    border-radius: 0.75rem;
    background-color: #f7f7f7;
    padding: 2rem;
    color: #333; /* dark gray text */
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    color: #00698f; /* blue title */
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: #666; /* dark gray label */
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #ccc; /* light gray border */
    outline: 0;
    background-color: #f7f7f7; /* light gray background */
    padding: 0.75rem 1rem;
    color: #333; /* dark gray text */
  }

  .input-group input:focus {
    border-color: #00698f; /* blue border on focus */
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #666; /* dark gray forgot password */
    margin: 8px 0 14px 0;
  }

  .forgot a,
  .signup a {
    color: #333; /* dark gray link */
    text-decoration: none;
    font-size: 14px;
  }

  .forgot a:hover,
  .signup a:hover {
    text-decoration: underline #00698f; /* blue underline on hover */
  }

  .sign {
    display: block;
    width: 100%;
    background-color: #00698f; /* blue button */
    padding: 0.75rem;
    text-align: center;
    color: #fff; /* white text */
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    margin-top: 20px;
  }

  .social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
  }

  .line {
    height: 1px;
    flex: 1 1 0%;
    background-color: #ccc; /* light gray line */
  }

  .social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #666; /* dark gray social message */
  }

  .social-icons {
    display: flex;
    justify-content: center;
  }

  .social-icons .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    background-color: transparent;
    margin-left: 8px;
  }

  .social-icons .icon svg {
    height: 1.25rem;
    width: 1.25rem;
    fill: #fff; /* white icon */
  }

  .signup {
    position: absolute;
    bottom: 20px;
    right: 75px;
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #666; /* dark gray signup */
  }`;

export default Form;
