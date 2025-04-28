import {
  DELETE_COMMENT,
  DELETE_POST,
  ADD_COMMENT,
  EDIT_COMMENT,
  GET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  UPDATE_POST,
} from "../actions/post.actions";

const initialState = [];

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      const newPosts = action.payload;
    
      // Filtrer les doublons
      const filteredPosts = newPosts.filter(
        (newPost) => !state.some((existingPost) => existingPost._id === newPost._id)
      );
    
      // Fusionner puis trier par date (du plus récent au plus ancien)
      const mergedPosts = [...state, ...filteredPosts].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    
      return mergedPosts;
    

      case LIKE_POST:
        return state.map((post) => {
          if (post._id === action.payload.postId) {
            return {
              ...post,
              likers: [...post.likers, action.payload.userId]
            };
          }
          return post;
        });
      
      case UNLIKE_POST:
        return state.map((post) => {
          if (post._id === action.payload.postId) {
            return {
              ...post,
              likers: post.likers.filter((id) => id !== action.payload.userId)
            };
          }
          return post;
        });

    case UPDATE_POST:
      return state.map((post) =>
        post._id === action.payload.postId
          ? { ...post, message: action.payload.message }
          : post
      );

    case DELETE_POST:
      return state.filter((post) => post._id !== action.payload.postId);

      case ADD_COMMENT:
        return state.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: [action.payload.comment, ...post.comments],
              }
            : post
        );
    
      case EDIT_COMMENT:
      return state.map((post) =>
        post._id === action.payload.postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === action.payload.commentid
                  ? { ...comment, text: action.payload.text }
                  : comment
              ),
            }
          : post
      );

    case DELETE_COMMENT:
      return state.map((post) =>
        post._id === action.payload.postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment._id !== action.payload.commentid
              ),
            }
          : post
      );

    default:
      return state;
  }
}
