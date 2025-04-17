import {
    FOLLOW_USER,
    GET_USER,
    UNFOLLOW_USER,
    UPDATE_BIO,
    UPLOAD_PICTURE,
    LOGIN_USER,
    LOGOUT_USER
  } from "../actions/user.actions";
  
  const initialState = {
    user: null,
    isLogged: false,
    picture: "",
    bio: "",
    following: []
  };
  
  export default function userReducer(state = initialState, action) {
    switch (action.type) {
      case LOGIN_USER:
        return {
          ...state,
          user: action.payload,
          isLogged: true
        };
        
      case LOGOUT_USER:
        return initialState;
        
      case GET_USER:
        return {
          ...state,
          user: action.payload
        };
        
      case UPLOAD_PICTURE:
        return {
          ...state,
          user: {
            ...state.user,
            picture: action.payload
          }
        };
        
      case UPDATE_BIO:
        return {
          ...state,
          user: {
            ...state.user,
            bio: action.payload
          }
        };
        
      case FOLLOW_USER:
        return {
          ...state,
          user: {
            ...state.user,
            following: [...state.user.following, action.payload.idToFollow]
          }
        };
        
      case UNFOLLOW_USER:
        return {
          ...state,
          user: {
            ...state.user,
            following: state.user.following.filter(
              id => id !== action.payload.idToUnfollow
            )
          }
        };
        
      default:
        return state;
    }
  }