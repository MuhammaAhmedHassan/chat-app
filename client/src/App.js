import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import { Container } from "react-bootstrap";
import "./App.scss";

import ApolloProvider from "./ApolloProvider";

// Pages
import { Register, Login, Home } from "./pages";

// Context
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";

// AuthRoute
import DynamicRoute from "./util/dynamicRoute";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Switch>
                <DynamicRoute exact path="/" component={Home} authenticated />
                <DynamicRoute
                  exact
                  path="/register"
                  component={Register}
                  guest
                />
                <DynamicRoute exact path="/Login" component={Login} guest />
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
