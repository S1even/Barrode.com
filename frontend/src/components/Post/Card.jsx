import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateParser, isEmpty } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";
import LikeButton from "./LikeButton";
import { updatePost } from "../../actions/post.actions";
import DeleteCard from "./DeleteCard";
import CardComments from "./CardComments";
import styled from "styled-components";
import MapViewer from "../MapViewer";



const Card = ({ post }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(usersData[0])) setIsLoading(false);
  }, [usersData]);

  const updateItem = () => {
    if (textUpdate) {
      dispatch(updatePost(post._id, textUpdate));
    }
    setIsUpdated(false);
  };

  return (
    <StyledCard key={post._id}>
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          <div className="card-left">
            <img
              src={
                !isEmpty(usersData[0]) &&
                usersData
                  .map((user) =>
                    user._id === post.posterId ? user.picture : null
                  )
                  .join("")
              }
              alt="poster-pic"
            />
          </div>
          <div className="card-right">
            <div className="card-header">
              <div className="pseudo">
                <h3>
                  {!isEmpty(usersData[0]) &&
                    usersData
                      .map((user) =>
                        user._id === post.posterId ? user.pseudo : null
                      )
                      .join("")}
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

            {userData._id === post.posterId && (
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

            <div className="card-footer">
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
                <span>{post.comments.length}</span>
              </div>
              <LikeButton post={post} />
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
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
              </svg>
            </div>

            {showComments && <CardComments post={post} />}

            <button
              onClick={() => setShowMap(true)}
              title="Voir le tracé"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
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
              <span style={{ marginLeft: "5px" }}>Voir le tracé</span>
            </button>
          </div>

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
  display: flex;
  background: #ffffff;
  border-radius: 20px;
  margin: 1.5rem 0;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 31, 63, 0.1);
  color: #001f3f;
  font-family: 'Inter', sans-serif;
  max-width: 800px; /* Limiter la largeur */
  margin-left: auto; /* Centrer le card */
  margin-right: auto; /* Centrer le card */

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

    .message {
      margin: 1rem 0;
      font-size: 1rem;
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

      img {
        width: 20px;
        cursor: pointer;
      }
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;

      .comment-icon {
        display: flex;
        align-items: center;
        gap: 0.3rem;

        img {
          width: 20px;
          cursor: pointer;
        }

        span {
          font-size: 0.9rem;
          color: #666;
        }
      }

      img {
        width: 20px;
        cursor: pointer;
        
      }
    }
  }
`;
