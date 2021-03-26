import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SnackbarProvider from "react-simple-snackbar";

import Home from "./views/Home";
import Register from "./views/Register";
import Find from "./views/Find";

import Header from "./main-components/Header";

import "./App.css";

function App() {
  return (
    <SnackbarProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/find">
            <Find />
          </Route>
        </Switch>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
