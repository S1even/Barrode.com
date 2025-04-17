import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../actions/user.actions";

const FollowHandler = ({ idToFollow, type }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const handleFollow = () => {
    dispatch(followUser(userData._id, idToFollow));
    setIsFollowed(true);
  };

  const handleUnfollow = () => {
    dispatch(unfollowUser(userData._id, idToFollow));
    setIsFollowed(false);
  };

  useEffect(() => {
    if (userData.following && userData.following.includes(idToFollow)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [userData, idToFollow]);

  return (
    <>
      {isFollowed && (
        <span onClick={handleUnfollow}>
          {type === "suggestion" && (
            <button className="unfollow-btn">Abonné</button>
          )}
          {type === "card" && (
            <button className="unfollow-btn">Abonné</button>
          )}
        </span>
      )}
      {!isFollowed && (
        <span onClick={handleFollow}>
          {type === "suggestion" && (
            <button className="follow-btn">Suivre</button>
          )}
          {type === "card" && <button className="follow-btn">Suivre</button>}
        </span>
      )}
    </>
  );
};

export default FollowHandler;