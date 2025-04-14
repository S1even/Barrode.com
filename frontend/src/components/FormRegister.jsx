import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const FormRegister = () => {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [controlPassword, setControlPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset des erreurs
    setSuccessMessage(""); // Reset des messages de succès

    // Validation des champs avant d'envoyer au backend
    if (password !== controlPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Appel API vers le backend pour l'inscription
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/register`,
        { email, pseudo, password }
      );

      // Si réussite, affichage du message de succès
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
    bottom: 150px;
    right: 500px;
    height: 600px;
    width: 400px;
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
    bottom: 10px;
    right: 95px;
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #666; /* dark gray signup */
  }`;

export default FormRegister;
