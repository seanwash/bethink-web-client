import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./page/Home";
import SessionPage from "./page/Session";

const App = () => (
  <Router>
    <Switch>
      <Route path="/sessions">
        <SessionPage />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  </Router>
);

export default App;
