import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";

// Component
import { FormGroupInput } from "../../component";

import { useMutation, gql } from "@apollo/client";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

function Register({ history }) {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, __) {
      // console.log(result);
      history.push("/login");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const onChange = (e) => {
    setVariables({ ...variables, [e.target.name]: e.target.value });
  };

  const submitRegisterForm = (e) => {
    e.preventDefault();

    registerUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>

        <Form onSubmit={submitRegisterForm}>
          <FormGroupInput
            name="email"
            label="E-mail"
            placeholder="Your email address"
            type="email"
            value={variables.email}
            onChange={onChange}
            error={errors.email}
          />
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
          <FormGroupInput
            name="confirmPassword"
            label="Password"
            placeholder="Confirm password"
            type="password"
            value={variables.confirmPassword}
            onChange={onChange}
            error={errors.confirmPassword}
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
              Register
            </Button>
            <br />
            <small>
              Already have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Register;
