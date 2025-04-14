export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";
export const GET_USER_ERRORS = "GET_USER_ERRORS";
export const GET_USERS = "GET_USERS";

export const getUsers = () => {
  return (dispatch) => {
    dispatch({ type: GET_USERS, payload: [] });
  };
};
