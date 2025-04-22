import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post.actions";
import Card from "./Post/Card";
import { isEmpty } from "./Utils";

const Thread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer);

  const loadPosts = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setIsLoading(true);
    
    console.log("Chargement de la page", page);
    const newPosts = await dispatch(getPosts(page, 5));
    
    setIsLoading(false);
    loadingRef.current = false;
    
    if (!newPosts || newPosts.length === 0 || newPosts.length < 5) {
      console.log("Plus de posts à charger");
      setHasMore(false);
    }
  }, [dispatch, page, hasMore]);

  useEffect(() => {
    loadPosts();
  }, [page, loadPosts]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const scrollThreshold = document.documentElement.scrollHeight - 200;
    
    if (scrollPosition >= scrollThreshold && !isLoading && hasMore && !loadingRef.current) {
      console.log("Défilement détecté, chargement de la page suivante");
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  console.log("Nombre de posts actuellement dans Redux:", posts.length);

  return (
    <div className="thread-container">
      <ul>
        {!isEmpty(posts) &&
          posts.map((post) => <Card post={post} key={post._id} />)}
      </ul>

      {isLoading && (
        <div className="loading-container">
          <div className="loading">Chargement...</div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="end-message">Vous avez vu tous les posts</div>
      )}
    </div>
  );
};

export default Thread;