import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, timestampParser } from "../Utils";
import { NavLink } from "react-router-dom";
import { addPost, getPosts } from "../../actions/post.actions";
import styled from "styled-components";

const NewPostForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [postPicture, setPostPicture] = useState(null);
  const [video, setVideo] = useState("");
  const [file, setFile] = useState();
  const userData = useSelector((state) => state.userReducer.user);
  const error = useSelector((state) => state.errorReducer.postError);
  const dispatch = useDispatch();
  
  const handlePost = async () => {
    if (message || postPicture || video) {
      const data = new FormData();
      data.append('posterId', userData._id);
      data.append('message', message);
      if (file) data.append("file", file);
      data.append('video', video);

      await dispatch(addPost(data));
      dispatch(getPosts());
      cancelPost();
    } else {
      alert("Veuillez entrer un message")
    }
  };
 
  const handlePicture = (e) => {
    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setVideo('');
  }; 

  const cancelPost = () => {
    setMessage("");
    setPostPicture("");
    setVideo("");
    setFile("");
  };


  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);

    const handleVideo = () => {
      let findLink = message.split(" ");
      for (let i = 0; i < findLink.length; i++) {
        if (
          findLink[i].includes("https://www.yout") ||
          findLink[i].includes("https://yout")
        ) {
          let embed = findLink[i].replace("watch?v=", "embed/");
          setVideo(embed.split("&")[0]);
          findLink.splice(i, 1);
          setMessage(findLink.join(" "));
          setPostPicture('');
        }
      }
    };
    handleVideo();
  }, [userData, message, video]);

  return (
    <PostContainer>
    <div className="post-container">
      {isLoading ? (
        <i className="fas fa-spinner fa-pulse"></i>
      ) : (
        <>
          <div className="data">
            <p>
              <span>{userData.following ? userData.following.length : 0}</span>{" "}
              Abonnement
              {userData.following && userData.following.length > 1 ? "s" : null}
            </p>
            <p>
              <span>{userData.followers ? userData.followers.length : 0}</span>{" "}
              Abonné
              {userData.followers && userData.followers.length > 1 ? "s" : null}
            </p>
          </div>
          <NavLink exact to="/profil">
            <div className="user-info">
              <img src={userData.picture} alt="user-img" />
            </div>
          </NavLink>
          <div className="post-form">
            <textarea
              name="message"
              id="message"
              placeholder="Quoi de neuf ?"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            {message || postPicture || video.length > 20 ? (
              <li className="card-container">
                <div className="card-left">
                  <img src={userData.picture} alt="user-pic" />
                </div>
                <div className="card-right">
                  <div className="card-header">
                    <div className="pseudo">
                      <h3>{userData.pseudo}</h3>
                    </div>
                    <span>{timestampParser(Date.now())}</span>
                  </div>
                  <div className="content">
                    <p>{message}</p>
                    <img src={postPicture} alt="" />
                    {video && (
                      <iframe
                        src={video}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video}
                      ></iframe>
                    )}
                  </div>
                </div>
              </li>
            ) : null}
<div className="footer-form">
  <div className="icon" onClick={() => document.getElementById('file-upload').click()} style={{ cursor: 'pointer' }}>
    {isEmpty(video) && (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-photo"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#2c3e50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="15" y1="8" x2="15.01" y2="8" />
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
          <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
        </svg>

        <input
          type="file"
          id="file-upload"
          name="file"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => handlePicture(e)}
          style={{ display: 'none' }}
        />
      </>
    )}
                {video && (
                  <button onClick={() => setVideo("")}>Supprimer video</button>
                )}
              </div>
              {!isEmpty(error.format) && <p>{error.format}</p>}
              {!isEmpty(error.maxSize) && <p>{error.maxSize}</p>}
              <div className="btn-send">
                {message || postPicture || video.length > 20 ? (
                  <button className="cancel" onClick={cancelPost}>
                    Annuler message
                  </button>
                ) : null}
                <button className="send" onClick={handlePost}>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </PostContainer>
  );
};

export default NewPostForm;

const PostContainer = styled.div`

  background: white;
  border-radius: 20px;
  padding: 1.5rem 2.5rem;
  margin: 1rem auto;
  max-width: 700px;
  color: #001f3f;
  font-family: 'Inter', sans-serif;

  .data {
    position: absolute;
    right: 40px;
    text-align: right;

    span {
      font-weight: bold;
      color: #00bfff;
    }
  }

  .user-info img {
    width: 60px;
    height: 60px;
    border-radius: 20px;
    object-fit: cover;
    box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }

  .post-form {
    textarea {
      width: 100%;
      height: 80px;
      padding: 10px;
      font-size: 1rem;
      border-radius: 12px;
      border: 1px solid #ddd;
      resize: none;
    }

    .card-container {
      margin-top: 1rem;
      display: flex;
      background: #f0f8ff;
      border-radius: 12px;
      padding: 10px;

      .card-left img {
        width: 50px;
        height: 50px;
        border-radius: 16px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;

        h3 {
          color: #001f3f;
        }

        span {
          font-size: 0.8rem;
          color: #666;
        }
      }

      .content p {
        margin: 5px 0;
      }

      .content img {
        width: 100%;
        border-radius: 8px;
        margin-top: 10px;
      }

      iframe {
        width: 100%;
        height: 300px;
        margin-top: 10px;
        border-radius: 8px;
      }
    }

    .footer-form {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;

      .icon {
        position: relative;
        input {
          opacity: 0;
          position: absolute;
          left: -9999px;
        }

        img {
          cursor: pointer;
          width: 24px;
        }

        button {
          background: none;
          border: none;
          color: #00bfff;
          cursor: pointer;
          font-size: 0.9rem;
        }
      }

      .btn-send {
        display: flex;
        gap: 0.5rem;

        .cancel {
          background: transparent;
          border: 1px solid #00bfff;
          padding: 6px 12px;
          border-radius: 12px;
          color: #00bfff;
          cursor: pointer;
        }

        .send {
          background: #00bfff;
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 12px;
          cursor: pointer;

          &:hover {
            background: #009ddb;
          }
        }
      }
    }
  }
`;