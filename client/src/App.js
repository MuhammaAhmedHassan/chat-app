import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Container } from "react-bootstrap";
import "./App.scss";

import ApolloProvider from "./ApolloProvider";

// Pages
import { Register, Login, Home } from "./pages";

function App() {
  return (
    <ApolloProvider>
      <BrowserRouter>
        <Container className="pt-5">
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/Login" component={Login} />
            <Route exact path="/Home" component={Home} />
          </Switch>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
