import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './views/Home'
import Register from './views/Register'
import Find from './views/Find'

import Header from "./main-components/Header";

import './App.css'

function App() {
  return (
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
  );
}

export default App;
