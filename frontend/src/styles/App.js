import React, { useEffect, useState } from "react";
import Routes from "./components/Routes";
import { UidContext } from "./components/AppContext";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "../actions/user.actions";

const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUid = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}jwtid`, {
          withCredentials: true,
        });
        setUid(res.data);
      } catch (err) {
        console.log("Utilisateur non connecté");
      }
    };

    fetchUid();
  }, []);

  useEffect(() => {
    if (uid) dispatch(getUser(uid));
  }, [uid, dispatch]);

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
