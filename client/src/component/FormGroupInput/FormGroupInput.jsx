import React from "react";
import { Form } from "react-bootstrap";

function FormGroupInput({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  // bootstrap concatenate the classes
  return (
    <Form.Group className={error && "text-danger"}>
      <Form.Label>{error ?? `${label}`}</Form.Label>
      <Form.Control
        className={error && "is-invalid"}
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
