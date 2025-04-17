import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBio } from "../../actions/user.actions";
import { dateParser } from "../Utils";
import FollowHandler from "./FollowHandler";
import UploadImg from "./UploadImg";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const [followingPopup, setFollowingPopup] = useState(false);
  const [followersPopup, setFollowersPopup] = useState(false);

  const dispatch = useDispatch();
  
  const { user, error } = useSelector((state) => state.userReducer);
  const users = useSelector((state) => state.userReducer.users);

  useEffect(() => {
    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user?.bio]);

  const handleUpdate = () => {
    if (bio !== user?.bio) {
      dispatch(updateBio(user._id, bio));
      setUpdateForm(false);
    }
  };

  if (!user) {
    return <div className="profil-container">Utilisateur non trouvé</div>;
  }

  return (
    <div className="profil-container">
      <h1>Profil de {user.pseudo || "l'utilisateur"}</h1>
      <div className="update-container">
        <div className="left-part">
          <h3>Photo de profil</h3>
          {user.picture && (
            <img 
              src={user.picture} 
              alt="user-pic" 
              className="profile-picture"
              onError={(e) => {
                e.target.src = "./public/img/uploads/profil/random-user.png";
              }}
            />
          )}
          <UploadImg />
          {error?.maxSize && <p className="error">{error.maxSize}</p>}
          {error?.format && <p className="error">{error.format}</p>}
        </div>
        <div className="right-part">
          <div className="bio-update">
            <h3>Bio</h3>
            {!updateForm ? (
              <>
                <p onClick={() => setUpdateForm(true)}>
                  {user.bio || "Aucune bio pour le moment"}
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
                  defaultValue={bio}
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
            <h4>Membre depuis le : {user.createdAt && dateParser(user.createdAt)}</h4>
            <div className="user-follow">
              <h5 onClick={() => setFollowingPopup(true)}>
                Abonnements : {user.following?.length || 0}
              </h5>
              <h5 onClick={() => setFollowersPopup(true)}>
                Abonnés : {user.followers?.length || 0}
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
              {users.map((followedUser) => {
                if (user.following?.includes(followedUser._id)) {
                  return (
                    <li key={followedUser._id}>
                      <img 
                        src={followedUser.picture || "/img/default-avatar.png"} 
                        alt="user-pic" 
                      />
                      <h4>{followedUser.pseudo}</h4>
                      <div className="follow-handler">
                        <FollowHandler 
                          idToFollow={followedUser._id} 
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
              {users.map((follower) => {
                if (user.followers?.includes(follower._id)) {
                  return (
                    <li key={follower._id}>
                      <img 
                        src={follower.picture || "/img/default-avatar.png"} 
                        alt="user-pic" 
                      />
                      <h4>{follower.pseudo}</h4>
                      <div className="follow-handler">
                        <FollowHandler 
                          idToFollow={follower._id} 
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