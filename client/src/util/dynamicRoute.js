import React from "react";
import { Redirect, Route } from "react-router-dom";
// context
import { useAuthState } from "../context/auth";

function DynamicRoute(props) {
  const { user } = useAuthState();

  if (props.authenticated && !user) return <Redirect to="/login" />;
  else if (props.guest && user) return <Redirect to="/" />;
  else return <Route component={props.component} {...props} />;
}

export default DynamicRoute;
