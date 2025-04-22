import React, { useContext } from "react";
import '../styles/feed.css';
import { useSelector } from "react-redux";
import { UidContext } from "../components/AppContext";
import { isEmpty } from "../components/Utils";
import Navbar from '../components/Navbar';
import Image from '../styles/assets/img/BanniereBarrode.png';
import Card from "../components/Post/Card";
import Trends from "../components/Trends";
import FriendsHint from "../components/Profil/FriendsHint";
import NewPostForm from "../components/Post/NewPostFrom";
import Thread from "../components/Thread";

const Feed = () => {
  const uid = useContext(UidContext);
  const trendList = useSelector((state) => state.trendingReducer);

  return (
    <div className="feed-page">
      <div className="home-container">
        <Navbar />
        <img src={Image} alt="Image Header" className="image-classPF" />
        <NewPostForm />
        <Thread />
        <ul>
          {!isEmpty(trendList[0]) && trendList.map((post) => <Card post={post} key={post._id} />)}
        </ul>
      </div>
      <div className="right-side">
        <div className="right-side-container">
          <Trends />
          {uid && <FriendsHint />}
        </div>
      </div>
    </div>
  );
};


export default Feed;
