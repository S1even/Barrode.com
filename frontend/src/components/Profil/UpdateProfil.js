import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBio } from "../../actions/user.actions";
import { dateParser } from "../Utils";
import FollowHandler from "./FollowHandler";
import UploadImg from "./UploadImg";

// Fonction utilitaire pour normaliser les IDs - ajoutée ici comme dans Card.jsx
const normalizeId = (id) => {
  if (!id) return "";
  return typeof id === 'object' && id._id ? id._id.toString() : id.toString();
};

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const [followingPopup, setFollowingPopup] = useState(false);
  const [followersPopup, setFollowersPopup] = useState(false);

  const dispatch = useDispatch();
  
  const userData = useSelector((state) => state.userReducer.user);
  const users = useSelector((state) => state.userReducer.users);
  const error = useSelector((state) => state.userReducer.error);

  const defaultProfileImage = "/img/random-user.png";

  // Normaliser l'ID utilisateur
  const userId = userData ? normalizeId(userData._id) : "";

  useEffect(() => {
    if (userData?.bio) {
      setBio(userData.bio);
    }
  }, [userData?.bio]);

  useEffect(() => {
    console.log("userData dans UpdateProfil:", userData);
    console.log("ID normalisé:", userId);
  }, [userData, userId]);

  const handleUpdate = () => {
    if (userId && bio !== userData?.bio) {
      console.log("Mise à jour de la bio pour l'utilisateur:", userId);
      dispatch(updateBio(userId, bio));
      setUpdateForm(false);
    } else {
      console.error("Impossible de mettre à jour la bio. ID manquant ou bio inchangée.");
    }
  };

  if (!userData) {
    return <div className="profil-container">Chargement du profil...</div>;
  }

  return (
    <div className="profil-container">
      <h1>Profil de {userData.pseudo || userData.name || "l'utilisateur"}</h1>
      <div className="update-container">
        <div className="left-part">
          <h3>Photo de profil</h3>
          {userData.picture ? (
            <img 
              src={userData.picture} 
              alt="user-pic" 
              className="profile-picture"
              onError={(e) => {
                console.log("Erreur de chargement d'image, utilisation de l'image par défaut");
                e.target.src = defaultProfileImage;
              }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <img 
              src={defaultProfileImage} 
              alt="default-user-pic" 
              className="profile-picture"
            />
          )}
          <UploadImg />
        </div>
        <div className="right-part">
          <div className="bio-update">
            <h3>Bio</h3>
            {!updateForm ? (
              <>
                <p onClick={() => setUpdateForm(true)}>
                  {userData.bio || "Aucune bio pour le moment"}
                </p>
                <button 
                  onClick={() => setUpdateForm(true)}
                  className="button update-btn"
                >
                  Modifier bio
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bio-textarea"
                />
                <button 
                  onClick={handleUpdate}
                  className="button validate-btn"
                >
                  Valider modifications
                </button>
              </>
            )}
          </div>
          <div className="user-info">
            <h4>Membre depuis le : {userData.createdAt && dateParser(userData.createdAt)}</h4>
            <div className="user-follow">
              <h5 onClick={() => setFollowingPopup(true)}>
                Abonnements : {userData.following?.length || 0}
              </h5>
              <h5 onClick={() => setFollowersPopup(true)}>
                Abonnés : {userData.followers?.length || 0}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {followingPopup && (
        <div className="popup-profil-container">
          <div className="modal">
            <h3>Abonnements</h3>
            <span 
              className="cross" 
              onClick={() => setFollowingPopup(false)}
            >
              &#10005;
            </span>
            <ul>
              {users?.map((followedUser) => {
                // Normaliser les IDs pour les comparaisons
                const followedUserId = normalizeId(followedUser._id);
                // Vérifier si l'ID de l'utilisateur suivi est dans le tableau following
                const isFollowed = userData.following?.some(id => normalizeId(id) === followedUserId);
                
                if (isFollowed) {
                  return (
                    <li key={followedUserId}>
                      <img 
                        src={followedUser.picture || defaultProfileImage} 
                        alt="user-pic" 
                        onError={(e) => { e.target.src = defaultProfileImage; }}
                      />
                      <h4>{followedUser.pseudo || followedUser.name}</h4>
                      <div className="follow-handler">
                        <FollowHandler 
                          idToFollow={followedUserId} 
                          type="suggestion" 
                        />
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </div>
      )}

      {followersPopup && (
        <div className="popup-profil-container">
          <div className="modal">
            <h3>Abonnés</h3>
            <span 
              className="cross" 
              onClick={() => setFollowersPopup(false)}
            >
              &#10005;
            </span>
            <ul>
              {users?.map((follower) => {
                // Normaliser les IDs pour les comparaisons
                const followerId = normalizeId(follower._id);
                // Vérifier si l'ID du follower est dans le tableau followers
                const isFollower = userData.followers?.some(id => normalizeId(id) === followerId);
                
                if (isFollower) {
                  return (
                    <li key={followerId}>
                      <img 
                        src={follower.picture || defaultProfileImage} 
                        alt="user-pic"
                        onError={(e) => { e.target.src = defaultProfileImage; }}
                      />
                      <h4>{follower.pseudo || follower.name}</h4>
                      <div className="follow-handler">
                        <FollowHandler 
                          idToFollow={followerId} 
                          type="suggestion" 
                        />
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfil;