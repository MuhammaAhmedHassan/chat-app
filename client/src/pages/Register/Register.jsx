import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

// Component
import { FormGroupInput } from "../../component";

function Register() {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (e) => {
    setVariables({ ...variables, [e.target.name]: e.target.value });
  };

  const submitRegisterForm = (e) => {
    e.preventDefault();

    console.log(variables);
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
          />
          <FormGroupInput
            name="username"
            label="Username"
            placeholder="Username"
            type="text"
            value={variables.username}
            onChange={onChange}
          />
          <FormGroupInput
            name="password"
            label="Password"
            placeholder="Your password"
            type="password"
            value={variables.password}
            onChange={onChange}
          />
          <FormGroupInput
            name="confirmPassword"
            label="Password"
            placeholder="Confirm password"
            type="password"
            value={variables.confirmPassword}
            onChange={onChange}
          />
          <div className="text-center">
            <Button variant="success" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Register;
