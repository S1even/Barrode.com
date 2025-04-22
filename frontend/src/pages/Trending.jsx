import React, { useContext } from "react";
import '../styles/feed.css';
import { useSelector } from "react-redux";
import { UidContext } from "../components/AppContext";
import Navbar from '../components/Navbar';
import { isEmpty } from "../components/Utils";
import Card from "../components/Post/Card";
import Trends from "../components/Trends";
import FriendsHint from "../components/Profil/FriendsHint";
import Image from '../styles/assets/img/BanniereBarrode.png';

const Trending = () => {
  const uid = useContext(UidContext);
  const trendList = useSelector((state) => state.trendingReducer);

  return <div className="trending-page">
          <div className="home-container">
    <Navbar />
    <img src={Image} alt="Image Header" className="image-classPF" />
    <div className="main">
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
  </div>;
};

export default Trending;