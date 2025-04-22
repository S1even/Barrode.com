import {
  FOLLOW_USER,
  GET_USER,
  UNFOLLOW_USER,
  UPDATE_BIO,
  UPLOAD_PICTURE,
  LOGIN_USER,
  LOGOUT_USER,
  GET_USER_ERRORS
} from "../actions/user.actions";

const initialState = {
  user: null,
  users: [],
  isLogged: false,
  error: null
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.payload,
        isLogged: true,
        error: null
      };
      
    case LOGOUT_USER:
      return initialState;
      
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        error: null
      };
    
    case "GET_USERS":
      return {
        ...state,
        users: action.payload,
        error: null
      };
      
    case UPLOAD_PICTURE:
      return {
        ...state,
        user: {
          ...state.user,
          picture: action.payload
        },
        error: null
      };
      
    case UPDATE_BIO:
      return {
        ...state,
        user: {
          ...state.user,
          bio: action.payload
        },
        error: null
      };
      
    case FOLLOW_USER:
      return {
        ...state,
        user: {
          ...state.user,
          following: [...(state.user.following || []), action.payload.idToFollow]
        },
        error: null
      };
      
    case UNFOLLOW_USER:
      return {
        ...state,
        user: {
          ...state.user,
          following: state.user.following?.filter(
            id => id !== action.payload.idToUnfollow
          ) || []
        },
        error: null
      };
    
    case GET_USER_ERRORS:
      return {
        ...state,
        error: action.payload
      };
      
    default:
      return state;
  }
}