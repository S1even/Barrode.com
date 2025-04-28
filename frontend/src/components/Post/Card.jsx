import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateParser, isEmpty } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";
import { updatePost, likePost, unlikePost } from "../../actions/post.actions";
import DeleteCard from "./DeleteCard";
import CardComments from "./CardComments";
import styled from "styled-components";
import MapViewer from "../MapViewer";
import { UidContext } from "../AppContext";

const Card = ({ post }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [liked, setLiked] = useState(false);

  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const uid = useContext(UidContext);

  useEffect(() => {
    if (!isEmpty(usersData[0])) setIsLoading(false);
  }, [usersData]);

  useEffect(() => {
    if (post.likers && post.likers.includes(uid)) setLiked(true);
    else setLiked(false);
  }, [uid, post.likers]);

  const updateItem = () => {
    if (textUpdate) {
      dispatch(updatePost(post._id, textUpdate));
    }
    setIsUpdated(false);
  };

  const handleLike = () => {
    // S'assurer que uid et post._id existent
    if (!uid || !post._id) {
      console.log("Missing uid or post._id", { uid, postId: post._id });
      return;
    }
  
    if (liked) {
      console.log("Unlike post", post._id, uid);
      dispatch(unlikePost(post._id, uid))
        .then(() => {
          console.log("Unlike successful");
        })
        .catch(err => {
          console.error("Unlike failed", err);
        });
    } else {
      console.log("Like post", post._id, uid);
      dispatch(likePost(post._id, uid))
        .then(() => {
          console.log("Like successful");
        })
        .catch(err => {
          console.error("Like failed", err);
        });
    }
  };

  return (
    <StyledCard key={post._id}>
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          <CardContent>
            <div className="card-left">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData.find(user => 
                    user._id === (post.posterId?._id || post.posterId)
                  )?.picture
                }
                alt="poster-pic"
              />
            </div>
            <div className="card-right">
              <div className="card-header">
                <div className="pseudo">
                  <h3>
                    {!isEmpty(usersData[0]) && (() => {
                      const postUser = usersData.find(user => 
                        user._id === (post.posterId?._id || post.posterId)
                      );
                      
                      if (!postUser) return "Utilisateur inconnu";
                      
                      // Afficher le pseudo ou le name (pour Google)
                      return postUser.pseudo || postUser.name;
                    })()}
                  </h3>
                  {post.posterId !== userData._id && (
                    <FollowHandler idToFollow={post.posterId} type={"card"} />
                  )}
                </div>
                <span>{dateParser(post.createdAt)}</span>
              </div>
    
              {!isUpdated ? (
                <p>{post.message}</p>
              ) : (
                <div className="update-post">
                  <textarea
                    defaultValue={post.message}
                    onChange={(e) => setTextUpdate(e.target.value)}
                  />
                  <div className="button-container">
                    <button className="btn" onClick={updateItem}>
                      Valider modification
                    </button>
                  </div>
                </div>
              )}

              {post.picture && (
                <img src={post.picture} alt="card-pic" className="card-pic" />
              )}
              {post.video && (
                <iframe
                  width="500"
                  height="300"
                  src={post.video}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={post._id}
                ></iframe>
              )}
              
              {userData._id === (post.posterId?._id || post.posterId) && (
                <div className="button-container">
                  <div onClick={() => setIsUpdated(!isUpdated)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#2c3e50"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                      <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                      <line x1="16" y1="5" x2="19" y2="8" />
                    </svg>
                  </div>
                  <DeleteCard id={post._id} />
                </div>
              )}
              <CardFooter>
                <div
                  className="comment-icon"
                  onClick={() => setShowComments(!showComments)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
                    <line x1="8" y1="9" x2="16" y2="9" />
                    <line x1="8" y1="13" x2="14" y2="13" />
                  </svg>
                  <span>{post.comments ? post.comments.length : 0}</span>
                </div>
                
                {uid ? (
                  <div className="like-icon" onClick={handleLike}>
                    {liked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#FF7B77"
                        fill="#FF7B77"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19.5 13.572l-7.5 7.428l-7.5-7.428m0 0a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20" 
                        height="20"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#2c3e50"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19.5 13.572l-7.5 7.428l-7.5-7.428m0 0a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572" />
                      </svg>
                    )}
                    <span>{post.likers ? post.likers.length : 0}</span>
                  </div>
                ) : (
                  <div className="like-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#2c3e50"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 13.572l-7.5 7.428l-7.5-7.428m0 0a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                    <span>{post.likers ? post.likers.length : 0}</span>
                  </div>
                )}
              </CardFooter>
              
              <MapButton
                onClick={() => setShowMap(true)}
                title="Voir le tracé"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#2c3e50"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 2L15 6L9 10L3 6L9 2Z" />
                  <path d="M15 6V18L9 22V10" />
                </svg>
                <span>Voir le tracé</span>
              </MapButton>
            </div>
          </CardContent>

          {showComments && (
            <CommentsSection>
              <CardComments post={post} />
            </CommentsSection>
          )}

          {showMap && (
            <MapViewer path={post.path} onClose={() => setShowMap(false)} />
          )}
        </>
      )}
    </StyledCard>
  );
};

export default Card;

const StyledCard = styled.li`
  background: #ffffff;
  border-radius: 20px;
  margin: 1.5rem auto;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 31, 63, 0.1);
  color: #001f3f;
  font-family: 'Inter', sans-serif;
  max-width: 800px;
  overflow: hidden;
`;

const CardContent = styled.div`
  display: flex;
  padding: 1.5rem;

  .card-left {
    margin-right: 1rem;

    img {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      object-fit: cover;
    }
  }

  .card-right {
    flex: 1;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .pseudo {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        h3 {
          margin: 0;
          color: #001f3f;
        }
      }

      span {
        font-size: 0.85rem;
        color: #888;
      }
    }

    p {
      margin: 1rem 0;
      line-height: 1.5;
    }

    .update-post {
      textarea {
        width: 100%;
        min-height: 80px;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 0.5rem;
        font-size: 0.95rem;
      }

      .button-container {
        margin-top: 0.5rem;

        .btn {
          background: #00bfff;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;

          &:hover {
            background: #009ddb;
          }
        }
      }
    }

    .card-pic {
      width: 100%;
      border-radius: 12px;
      margin-top: 1rem;
    }

    iframe {
      width: 100%;
      height: 300px;
      border-radius: 12px;
      margin-top: 1rem;
    }

    .button-container {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;

      div {
        cursor: pointer;
      }
    }
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  .comment-icon, .like-icon {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }

    span {
      font-size: 0.9rem;
      color: #666;
    }
  }

  img, svg {
    width: 20px;
    cursor: pointer;
  }
`;

const MapButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  margin-top: 10px;
  color: #2c3e50;
  font-size: 14px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  svg {
    margin-right: 5px;
  }
`;

const CommentsSection = styled.div`
  border-top: 1px solid #eaeaea;
  padding: 1rem 1.5rem;
  background-color: #fafafa;
`;