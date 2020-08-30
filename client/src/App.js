import React from "react";
import { Container } from "react-bootstrap";
import "./App.scss";

// Pages
import { Register } from "./pages";

function App() {
  return (
    <Container className="pt-5">
      <Register />
    </Container>
  );
}

export default App;
