import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Row, Button } from "react-bootstrap";

// Component
import Users from "./Users";
import Messages from "./Messages";
// context
import { useAuthDispatch } from "../../context/auth";
// types
import { LOGOUT } from "../../context/types";

function Home({ history }) {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: LOGOUT });
    window.location.href = "/login";
  };

  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>

        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>

      <Row className="bg-white">
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
}

export default Home;
