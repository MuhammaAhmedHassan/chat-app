import React from "react";
import { Form } from "react-bootstrap";

function FormGroupInput({ label, type, name, value, onChange, placeholder }) {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </Form.Group>
  );
}

export default FormGroupInput;
