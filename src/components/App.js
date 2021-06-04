import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "use-http";
import Home from "./pages/home";
import Register from "./pages/register";
import Find from "./pages/find";

import Header from "./main-components/header";

import "./App.css";

const fetchOptions = { timeout: 10000, retries: 1}

function App() {
  return (
    <Provider url={process.env.REACT_APP_API_BASE} options={fetchOptions}>
      <Router>
        <Header />
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/find" component={Find} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
