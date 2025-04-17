import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers";
import { getUsers } from "./actions/user.actions";
import { getPosts } from "./actions/post.actions";
import { BrowserRouter } from "react-router-dom";
import { checkUserLoggedIn } from "./actions/user.actions";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

store.dispatch(getUsers());
store.dispatch(checkUserLoggedIn());
store.dispatch(getPosts());

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);