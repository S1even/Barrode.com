
import axios from "./axios";
import { GET_USER, LOGOUT_USER } from "../actions/user.actions";


export const checkAuthStatus = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get('/api/user/me', { withCredentials: true });
      
      if (res.data && (res.data._id || res.data.googleId)) {
        console.log("Utilisateur authentifié détecté:", res.data);
        dispatch({ type: GET_USER, payload: res.data });
        return res.data;
      } else {
        console.log("Aucun utilisateur authentifié");
        dispatch({ type: LOGOUT_USER });
        return null;
      }
    } catch (err) {
      console.error("Erreur de vérification d'authentification:", err);
      dispatch({ type: LOGOUT_USER });
      return null;
    }
  };
};


export const initiateGoogleLogin = () => {

  window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/auth/google`;
};


export const checkCookies = () => {
  console.log("Cookies actuels:", document.cookie);
  return document.cookie;
};