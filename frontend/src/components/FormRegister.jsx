import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import BouttonGoogleRegister from "./BouttonGoogleRegister";

const FormRegister = () => {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [controlPassword, setControlPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== controlPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/register`,
        { email, pseudo, password }
      );

      setSuccessMessage("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setEmail("");
      setPseudo("");
      setPassword("");
      setControlPassword("");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErrorMessage(error.response?.data?.errors?.email || "Une erreur est survenue.");
    }
  };

  return (
    <StyledWrapper>
      <div className="form-container">
        <p className="title">Crée un compte</p>
        {/* Affichage des messages d'erreur et de succès */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form className="form" onSubmit={handleRegister}>
          {/* Champ Email */}
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Champ Pseudo */}
          <div className="input-group">
            <label htmlFor="pseudo">Pseudo</label>
            <input
              type="text"
              id="pseudo"
              placeholder="Entrez votre pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </div>

          {/* Champ Mot de Passe */}
          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Champ Confirmation du Mot de Passe */}
          <div className="input-group">
            <label htmlFor="password-conf">Confirmer le Mot de Passe</label>
            <input
              type="password"
              id="password-conf"
              placeholder="Confirmez votre mot de passe"
              value={controlPassword}
              onChange={(e) => setControlPassword(e.target.value)}
              required
            />
          </div>

          {/* Bouton de Soumission */}
          <button className="sign" type="submit">
            Crée un compte
          </button>
        </form>

        {/* Ligne sociale et boutons supplémentaires */}
        <div className="social-message">
          <div className="line" />
          <p className="message">Ou</p>
          <div className="line" />
        </div>
        <div className="social-icons">
          <button aria-label="Log in with Google" className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current" />
          </button>
          <button aria-label="Log in with Twitter" className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current" />
          </button>
          <button aria-label="Log in with GitHub" className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current" />
          </button>
        </div>
        <BouttonGoogleRegister />
        <p className="signup">
          Vous possédez un compte ?{" "}
          <a rel="noopener noreferrer" href="/login" className="link">
            S'identifier
          </a>
        </p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form-container {
    position: absolute;
    top: 30%;
    left: 50%;  /* Centrage horizontal */
    max-width: 100%;
    margin: 0 auto;
    padding: 1.5rem;
    background-color: #f7f7f7;
    border-radius: 0.75rem;
    color: #333;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
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
    justify-content: center;
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
    margin-top: 1rem;
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
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #666;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    .form-container {
      top: 50%;  /* Ajuste la position verticale pour les petits écrans */
      transform: translate(-50%, -50%);  /* Centrage horizontal et vertical */
    }

    .title {
      font-size: 1.25rem;
    }

    .input-group input {
      padding: 0.75rem;
    }

    .sign {
      padding: 0.75rem;
      font-size: 1rem;
    }

    .social-message .message {
      font-size: 0.75rem;
    }

    .signup {
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    .form-container {
      width: 90%;  /* Réduire la largeur à 90% sur les très petits écrans */
    }

    .title {
      font-size: 1.1rem;
    }

    .input-group input {
      padding: 0.75rem;
    }

    .sign {
      padding: 0.75rem;
      font-size: 1rem;
    }

    .social-message .message {
      font-size: 0.75rem;
    }

    .signup {
      font-size: 0.7rem;
    }
  }
`;

export default FormRegister;
