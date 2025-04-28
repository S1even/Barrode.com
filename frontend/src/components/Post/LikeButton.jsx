import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";
import styled from "styled-components";

const LikeButton = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  const like = () => {
    console.log("Like post:", post._id, uid);
    dispatch(likePost(post._id, uid));
    setLiked(true);
  };

  const unlike = () => {
    console.log("Unlike post:", post._id, uid);
    dispatch(unlikePost(post._id, uid));
    setLiked(false);
  };

  useEffect(() => {
    if (post.likers && post.likers.includes(uid)) setLiked(true);
    else setLiked(false);
  }, [uid, post.likers]);

  return (
    <LikeContainer>
      {uid === null && (
        <Popup
          trigger={
            <HeartIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
              </svg>
            </HeartIcon>
          }
          position={["bottom center", "bottom right", "bottom left"]}
          closeOnDocumentClick
        >
          <div>Connectez-vous pour aimer un post !</div>
        </Popup>
      )}

      {uid && !liked && (
        <HeartIcon onClick={like} className="not-liked">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
          </svg>
        </HeartIcon>
      )}

      {uid && liked && (
        <HeartIcon onClick={unlike} className="liked">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
          </svg>
        </HeartIcon>
      )}

      <LikeCount>{post.likers ? post.likers.length : 0}</LikeCount>
    </LikeContainer>
  );
};

const LikeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

// Dans LikeButton.jsx
const HeartIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  /* S'assurer que ces styles sont bien appliqués */
  &.not-liked svg {
    fill: none;
    stroke: #2c3e50;
    stroke-width: 1.5;
  }

  &.liked svg {
    fill: #e74c3c;
    stroke: #e74c3c;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const LikeCount = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

export default LikeButton;