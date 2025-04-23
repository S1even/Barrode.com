import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post.actions";
import Card from "./Post/Card";
import { isEmpty } from "./Utils";
import InfiniteScroll from "react-infinite-scroll-component";

const Thread = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadPosts = useCallback(async () => {
    console.log("loadPosts lancé pour page :", page);
    setIsLoading(true);

    const newPosts = await dispatch(getPosts(page, 5));

    if (!newPosts || newPosts.length < 5) {
      setHasMore(false);
    } else {
      setPage((prevPage) => prevPage + 1);
    }

    setIsLoading(false);
  }, [dispatch, page]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !isLoading) {
        console.log("Scroll détecté en bas de page");
        loadPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, loadPosts]);

  return (
    <div className="thread-container">
      {!isEmpty(posts) && (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadPosts}
          hasMore={hasMore}
          loader={<div className="loading">Chargement...</div>}
          endMessage={<div className="end-message">Tous les posts sont affichés</div>}
        >
          {posts.map((post) => (
            <Card post={post} key={post._id} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Thread;
