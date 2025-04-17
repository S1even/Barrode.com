import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getUser } from './actions/user.actions';

export const UidContext = createContext();
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}jwtid`,
          withCredentials: true,
        });
        
        setUid(res.data);
        if (res.data) dispatch(getUser(res.data));
      } catch (err) {
        console.log("No token");
      }
    };
    fetchToken();
  }, [dispatch]);

  return (
    <UidContext.Provider value={uid}>
      {children}
    </UidContext.Provider>
  );
};