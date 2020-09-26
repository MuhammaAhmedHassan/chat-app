import React, { createContext, useReducer, useContext } from "react";
import { LOGIN, LOGOUT, TOKEN } from "./types";
import jwtDecode from "jwt-decode";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const initialState = {
  user: null,
};

const token = localStorage.getItem(TOKEN);

if (token) {
  const decodedToken = jwtDecode(token);
  const expired = decodedToken.exp * 1000 < new Date();
  if (expired) {
    localStorage.removeItem(TOKEN);
  } else initialState.user = decodedToken;
} else console.log("no token found");

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem(TOKEN, action.payload.token);
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem(TOKEN);
      return {
        ...state,
        user: null,
      };

    default:
      throw new Error(`Unkown action type ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
