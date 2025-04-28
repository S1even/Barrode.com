import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../actions/user.actions";

const FollowHandler = ({ idToFollow, type }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const currentUserId = userData._id || (userData.user && userData.user._id);
  
  const idToFollowString = typeof idToFollow === 'object' ? idToFollow._id : idToFollow;

  const isOwnProfile = currentUserId === idToFollowString;

  const handleFollow = () => {
    if (!idToFollowString || !currentUserId) {
      console.log("ID manquant:", { idToFollowString, currentUserId });
      return;
    }

    dispatch(followUser(currentUserId, idToFollowString))
      .then(() => {
        setIsFollowed(true);
      })
      .catch(err => {
        console.error("Erreur lors du suivi:", err);
      });
  };

  const handleUnfollow = () => {
    if (!idToFollowString || !currentUserId) {
      console.log("ID manquant:", { idToFollowString, currentUserId });
      return;
    }

    dispatch(unfollowUser(currentUserId, idToFollowString))
      .then(() => {
        setIsFollowed(false);
      })
      .catch(err => {
        console.error("Erreur lors du désabonnement:", err);
      });
  };

  useEffect(() => {
    const following = userData.following || (userData.user && userData.user.following) || [];
    if (idToFollowString && following.includes(idToFollowString)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [userData, idToFollowString]);

  if (isOwnProfile || !idToFollowString) return null;

  return (
    <>
      {isFollowed ? (
        <span onClick={handleUnfollow}>
          {type === "suggestion" && <button className="unfollow-btn">Abonné</button>}
          {type === "card" && <button className="unfollow-btn">Abonné</button>}
        </span>
      ) : (
        <span onClick={handleFollow}>
          {type === "suggestion" && <button className="follow-btn">Suivre</button>}
          {type === "card" && <button className="follow-btn">Suivre</button>}
        </span>
      )}
    </>
  );
};

export default FollowHandler;