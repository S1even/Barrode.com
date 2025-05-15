import axios from "../utils/axios";

// User action types
export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";
export const GET_USER_ERRORS = "GET_USER_ERRORS";
export const GET_USERS = "GET_USERS";
export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";

// Fonction utilitaire pour normaliser les IDs
const normalizeId = (id) => {
  if (!id) return "";
  return typeof id === 'object' && id._id ? id._id.toString() : id.toString();
};

// Connexion
export const loginUser = (email, password) => {
  return (dispatch) => {
    return axios
      .post(`/api/user/login`, { email, password })
      .then((res) => {
        dispatch({ type: LOGIN_USER, payload: res.data.user });
        return res.data;
      })
      .catch((err) => {
        console.error("Erreur lors de la connexion :", err);
        throw err;
      });
  };
};

// Déconnexion
export const logoutUser = () => {
  return (dispatch) => {
    axios.get(`/api/user/logout`, { withCredentials: true })
      .then(() => {
        console.log("Utilisateur déconnecté");
        dispatch({ type: LOGOUT_USER });
      })
      .catch((err) => {
        console.error("Erreur lors de la déconnexion :", err);
        dispatch({ type: LOGOUT_USER });
      });
  };
};

// Vérification de l'état de connexion au chargement de l'app
export const checkUserLoggedIn = () => {
  return (dispatch) => {
    return axios
    .get(`/api/user/me`, { withCredentials: true })
      .then((res) => {
        console.log("Données utilisateur chargées :", res.data);
        // Stocker les données utilisateur dans Redux
        dispatch({ type: GET_USER, payload: res.data });
        return res.data;
      })
      .catch((err) => {
        console.error("Erreur lors de la vérification de l'authentification :", err);
        dispatch({ type: LOGOUT_USER });
        return null;
      });
  };
};

// Récupération de tous les utilisateurs
export const getUsers = () => {
  return (dispatch) => {
    return axios
      .get(`/api/user`, { withCredentials: true })
      .then((res) => {
        console.log("Liste des utilisateurs récupérée :", res.data);
        dispatch({ type: GET_USERS, payload: res.data });
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des utilisateurs :", err);
      });
  };
};

// Récupération des données d'un utilisateur spécifique
export const getUser = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/user/me`, { withCredentials: true });
    dispatch({ type: GET_USER, payload: res.data });
  } catch (err) {
    console.error("Erreur lors du getUser :", err);
  }
};

// Mise à jour de la bio utilisateur
export const updateBio = (userId, bio) => {
  userId = normalizeId(userId); // Normaliser l'ID avant utilisation
  console.log("Mise à jour de la bio pour ID :", userId, "Bio :", bio);
  return (dispatch) => {
    return axios({
      method: "put",
      url: `/api/user/` + userId,
      data: { bio },
      withCredentials: true
    })
      .then((res) => {
        console.log("Réponse mise à jour bio :", res.data);
        dispatch({ type: UPDATE_BIO, payload: bio });
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour de la bio :", err);
      });
  };
};

// Upload de l'image utilisateur
export const uploadPicture = (data, id) => {
  id = normalizeId(id); // Normaliser l'ID avant utilisation
  console.log("Upload de la photo de profil pour ID :", id);
  return (dispatch) => {
    return axios
      .post(`/api/user/upload`, data, { withCredentials: true })
      .then((res) => {
        console.log("Réponse upload image :", res.data);
        if (res.data.errors) {
          console.error("Erreurs de validation de l'image :", res.data.errors);
          dispatch({ type: GET_USER_ERRORS, payload: res.data.errors });
        } else {
          dispatch({ type: GET_USER_ERRORS, payload: "" });
          return axios
            .get(`/api/user/${id}`, { withCredentials: true })
            .then((res) => {
              console.log("Nouvelle photo de profil récupérée :", res.data.picture);
              dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture });
            });
        }
      })
      .catch((err) => {
        console.error("Erreur lors du téléchargement de l'image :", err);
      });
  };
};

export const followUser = (followerId, idToFollow) => {
  followerId = normalizeId(followerId); // Normaliser l'ID avant utilisation
  idToFollow = normalizeId(idToFollow); // Normaliser l'ID avant utilisation
  console.log("Demande de suivi utilisateur :", idToFollow, "par :", followerId);
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `/api/user/follow/` + followerId,
      data: { idToFollow },
      withCredentials: true
    })
      .then((res) => {
        console.log("Réponse suivi utilisateur :", res.data);
        dispatch({ type: FOLLOW_USER, payload: { idToFollow } });
      })
      .catch((err) => {
        console.error("Erreur lors du suivi utilisateur :", err);
      });
  };
};

export const unfollowUser = (followerId, idToUnfollow) => {
  followerId = normalizeId(followerId); // Normaliser l'ID avant utilisation
  idToUnfollow = normalizeId(idToUnfollow); // Normaliser l'ID avant utilisation
  console.log("Demande d'arrêt de suivi utilisateur :", idToUnfollow, "par :", followerId);
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `/api/user/unfollow/` + followerId,
      data: { idToUnfollow },
      withCredentials: true
    })
      .then((res) => {
        console.log("Réponse arrêt de suivi utilisateur :", res.data);
        dispatch({ type: UNFOLLOW_USER, payload: { idToUnfollow } });
      })
      .catch((err) => {
        console.error("Erreur lors de l'arrêt du suivi utilisateur :", err);
      });
  };
};