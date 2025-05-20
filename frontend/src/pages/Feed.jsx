import React, { useContext } from "react";
import '../styles/feed.css';
import { useSelector } from "react-redux";
import { UidContext } from "../components/AppContext";
import { isEmpty } from "../components/Utils";
import Navbar from '../components/Navbar';
import Card from "../components/Post/Card";
import FriendsHint from "../components/Profil/FriendsHint";
import NewPostForm from "../components/Post/NewPostFrom";
import Thread from "../components/Thread";
import styled from "styled-components";

const Feed = () => {
  const uid = useContext(UidContext);
  const trendList = useSelector((state) => state.trendingReducer);

  return (
    <FeedContainer className="feed-page">
      <MainContent className="home-container">
        <div className="sticky-header">
          <Navbar />
          <NewPostForm />
        </div>
        <div className="scrollable-content">
          <Thread />
          <PostsList>
            {!isEmpty(trendList[0]) && 
              trendList.map((post) => (
                <Card post={post} key={post._id} />
              ))
            }
          </PostsList>
        </div>
      </MainContent>
      <SideContent className="right-side">
        <div className="right-side-container">
          {uid && <FriendsHint />}
        </div>
      </SideContent>
    </FeedContainer>
  );
};

const FeedContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(255, 255, 255, 0.95);
    border-bottom: 1px solid #eaeaea;
    width: 100%;
  }
  
  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 1rem;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
  }
`;

const SideContent = styled.div`
  flex: 1;
  min-height: 100vh;
  overflow-y: auto;
  border-left: 1px solid #eaeaea;
  padding: 1rem;
  
  @media (max-width: 768px) {
    display: none; /* Masquer sur mobile pour simplifier */
  }
`;

const PostsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 800px; /* Limite la largeur pour un meilleur affichage */
`;

export default Feed;