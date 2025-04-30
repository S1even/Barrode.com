import axios from "../utils/axios";

// posts
export const GET_POSTS = "GET_POSTS";
export const GET_ALL_POSTS = "GET_ALL_POSTS";
export const ADD_POST = "ADD_POST";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

// comments
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// trends
export const GET_TRENDS = "GET_TRENDS";

// errors
export const GET_POST_ERRORS = "GET_POST_ERRORS";

export const getPosts = (page = 1, limit = 5) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `/api/post?page=${page}&limit=${limit}`
      );

      dispatch({ type: GET_POSTS, payload: res.data });

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
};

export const addPost = (data) => {
  return async (dispatch, getState) => {
    try {
      const userData = getState().userReducer.user;
      const userId = userData && userData._id ? 
        (typeof userData._id === 'object' && userData._id._id ? 
          userData._id._id.toString() : userData._id.toString()) 
        : null;
      
      if (!userId) {
        console.error("Erreur : userId introuvable");
        return;
      }

      const formData = data instanceof FormData ? data : new FormData();
      if (!formData.has('posterId')) {
        formData.append('posterId', userId);
      }

      const res = await axios.post(
        `/api/post/`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data.errors) {
        dispatch({ type: GET_POST_ERRORS, payload: res.data.errors });
      } else {
        dispatch({ type: GET_POST_ERRORS, payload: "" });
        dispatch(getPosts());
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du post:", err);
      const errorMessage = err.response?.data?.errors || "Erreur réseau ou inconnue";
      dispatch({ type: GET_POST_ERRORS, payload: errorMessage });
    }
  };
};

export const likePost = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `/api/post/like-post/${postId}`,
      data: { id: userId },
      withCredentials: true,
    })
      .then(() => {
        dispatch({ type: LIKE_POST, payload: { postId, userId } });
      })
      .catch((err) => {
        console.error("Like error:", err);
      });
  };
};

export const unlikePost = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `/api/post/unlike-post/${postId}`,
      data: { id: userId },
      withCredentials: true,
    })
      .then(() => {
        dispatch({ type: UNLIKE_POST, payload: { postId, userId } });
      })
      .catch((err) => {
        console.error("Unlike error:", err);
      });
  };
};

export const updatePost = (postId, message) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `/api/post/${postId}`,
      data: { message },
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: UPDATE_POST, payload: { message, postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const deletePost = (postId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `/api/post/${postId}`,
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: DELETE_POST, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const addComment = (postId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `/api/post/comment-post/${postId}`,
      data: { commenterId, text, commenterPseudo },
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ 
          type: ADD_COMMENT, 
          payload: { 
            postId,
            comment: res.data.comment || { commenterId, text, commenterPseudo, timestamp: Date.now() } 
          } 
        });
      })
      .catch((err) => console.log(err));
  };
};

export const editComment = (postId, commentid, text) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `/api/post/edit-comment-post/${postId}`,
      data: { commentid, text },
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: EDIT_COMMENT, payload: { postId, commentid, text } });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteComment = (postId, commentid) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `/api/post/delete-comment-post/${postId}`,
      data: { commentid },
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: DELETE_COMMENT, payload: { postId, commentid } });
      })
      .catch((err) => console.log(err));
  };
};

export const getTrends = (sortedArray) => {
  return (dispatch) => {
    dispatch({ type: GET_TRENDS, payload: sortedArray });
  };
};