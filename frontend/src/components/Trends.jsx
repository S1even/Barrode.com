import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrends } from "../actions/post.actions";
import { isEmpty } from "./Utils";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Trends = () => {
  const posts = useSelector((state) => state.allPostsReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const trendList = useSelector((state) => state.trendingReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(posts[0])) {
      const postsArr = Object.keys(posts).map((i) => posts[i]);
      let sortedArray = postsArr.sort((a, b) => b.likers.length - a.likers.length);
      sortedArray.length = 3;
      dispatch(getTrends(sortedArray));
    }
  }, [posts, dispatch]);

  return (
    <TrendingWrapper>
      <div className="trending-box">
        <h4>Tendances</h4>
        <NavLink to="/trending">
          <ul>
            {trendList.length > 0 &&
              trendList.map((post) => {
                const poster = !isEmpty(usersData[0])
                  ? usersData.find((user) => user._id === post.posterId)
                  : null;

                return (
                  <li key={post._id}>
                    <div className="media">
                      {post.picture && <img src={post.picture} alt="post" />}
                      {post.video && (
                        <iframe
                          src={post.video}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={post._id}
                        ></iframe>
                      )}
                      {!post.picture && !post.video && (
                        <img src={poster?.picture} alt="profil" />
                      )}
                    </div>
                    <div className="trend-content">
                      <p>{post.message}</p>
                      <span>Lire</span>
                    </div>
                  </li>
                );
              })}
          </ul>
        </NavLink>
      </div>
    </TrendingWrapper>
  );
};

export default Trends;

// Styles

const TrendingWrapper = styled.div`
  position: fixed;
  right: 30px;
  top: 120px;
  width: 280px;
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  color: #001f3f;
  font-family: 'Inter', sans-serif;
  z-index: 99;

  .trending-box {
    h4 {
      margin-bottom: 1rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #00bfff;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-bottom: 1rem;
        background: #f9f9f9;
        border-radius: 12px;
        padding: 0.7rem;
        transition: all 0.3s ease;

        &:hover {
          background-color: #eaf6ff;
        }

        .media {
          width: 50px;
          height: 50px;

          img,
          iframe {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            object-fit: cover;
          }

          iframe {
            border: none;
          }
        }

        .trend-content {
          flex: 1;

          p {
            margin: 0;
            font-size: 0.85rem;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 150px;
          }

          span {
            display: inline-block;
            margin-top: 0.3rem;
            font-size: 0.75rem;
            color: #00bfff;
          }
        }
      }
    }
  }
`;
