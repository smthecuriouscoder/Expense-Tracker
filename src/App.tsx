import React from "react";
import LandingPage from "./pages/LandingPage";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import { Route, Switch } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      {/* <Header /> */}
      <Switch>
        <Route exact path='/'>
          <LandingPage />
        </Route>
        <Route path='/signin'>
          <SignIn />
        </Route>
        <Route path='/signup'>
          <SignUp />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
