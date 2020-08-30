import React, { useState } from "react";
import { Link } from "react-router-dom";
// Component
import { FormGroupInput } from "../../component";

import { useLazyQuery, gql } from "@apollo/client";

import { Row, Col, Form, Button, Spinner } from "react-bootstrap";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

function Login({ history }) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      localStorage.setItem("token", data.login.token);
      history.push("/");
    },
  });

  const onChange = (e) => {
    setVariables({ ...variables, [e.target.name]: e.target.value });
  };

  const submitLoginForm = (e) => {
    e.preventDefault();

    loginUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>

        <Form onSubmit={submitLoginForm}>
          <FormGroupInput
            name="username"
            label="Username"
            placeholder="Username"
            type="text"
            value={variables.username}
            onChange={onChange}
            error={errors.username}
          />
          <FormGroupInput
            name="password"
            label="Password"
            placeholder="Your password"
            type="password"
            value={variables.password}
            onChange={onChange}
            error={errors.password}
          />
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading && (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  &nbsp;&nbsp;&nbsp;
                </>
              )}
              Login
            </Button>
            <br />
            <small>
              Don't have an account? <Link to="/register">Register</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
