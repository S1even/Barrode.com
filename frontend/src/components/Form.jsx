import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { loginUser } from '../actions/user.actions';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(email, password));
      console.log('Connexion réussie');
      navigate('/feed');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage(error.response?.data?.message || 'Email ou mot de passe incorrect');
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
    color: #333;
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    color: #00698f;
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
    color: #666;
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #ccc;
    outline: 0;
    background-color: #f7f7f7;
    padding: 0.75rem 1rem;
    color: #333;
  }

  .input-group input:focus {
    border-color: #00698f;
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #666;
    margin: 8px 0 14px 0;
  }

  .forgot a,
  .signup a {
    color: #333;
    text-decoration: none;
    font-size: 14px;
  }

  .forgot a:hover,
  .signup a:hover {
    text-decoration: underline #00698f;
  }

  .sign {
    display: block;
    width: 100%;
    background-color: #00698f;
    padding: 0.75rem;
    text-align: center;
    color: #fff;
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
    background-color: #ccc;
  }

  .social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #666;
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
    fill: #fff;
  }

  .signup {
    position: absolute;
    bottom: 20px;
    right: 75px;
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #666;
  }`;

export default Form;