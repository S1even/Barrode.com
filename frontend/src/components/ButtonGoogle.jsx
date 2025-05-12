import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

const ButtonGoogle = () => {
  return (
    <StyledWrapper>
      <Link to="https://barrodecom-production.up.railway.app/auth/google" className="google-button-link">
        <button className="google-button">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="google-icon"
          />
          S'identifier avec Google
        </button>
      </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  .google-button {
    max-width: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1.2rem;
    font-size: 0.875rem;
    font-weight: 600;
    gap: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.25);
    color: #333;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .google-icon {
    height: 20px;
    width: 20px;
  }

  .google-button:hover {
    transform: scale(1.02);
  }
`;

export default ButtonGoogle;
