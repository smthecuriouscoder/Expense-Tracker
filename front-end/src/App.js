import React, { Component } from "react";
import HomePage from "./components/Homepage";
import LogIn from "./components/Login";
import DashBoard from "./components/Dashboard";
import Analysis from "./components/Analysis";
import Settings from "./components/Settings";
import Notfound from "./components/Notfound";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

class App extends Component {
  constructor() {
    super();

    this.state = {
      isSignedIn: JSON.parse(sessionStorage.getItem("status")) || false, //for altering the behaviour of 'Get Started' button and 'Log In' link
      user: JSON.parse(sessionStorage.getItem("user")) || {}, //for storing the logged in user details
    };
  }

  handleLogInStatus = (status, data = {}) => {
    this.setState({
      isSignedIn: status,
      user: data,
    });
    sessionStorage.setItem("status", status);
    sessionStorage.setItem("user", JSON.stringify(data));
  };

  handleUpdateUserDetails = (data) => {
    console.log("Called");
    this.setState({
      user: {
        ...this.state.user,
        email: data.email,
      },
    });
    sessionStorage.setItem("user", JSON.stringify(this.state.user));
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path='/'
            render={(props) => <HomePage loggedInStatus={this.state.isSignedIn} />}
          />
          <Route
            exact
            path='/login'
            render={(props) =>
              !this.state.isSignedIn ? (
                <LogIn {...props} handleLogInStatus={this.handleLogInStatus} />
              ) : (
                <Redirect
                  to={{
                    pathname: "/dashboard",
                    state: {
                      email: this.state.user.email,
                      profilePhoto: this.state.user.imageUrl,
                      googleSignIn: Boolean(this.state.user.googleId),
                    },
                  }}
                />
              )
            }
          />
          <Route
            exact
            path='/dashboard'
            render={(props) =>
              this.state.isSignedIn ? (
                <DashBoard
                  {...props}
                  isSignedIn={this.state.isSignedIn}
                  userDetails={this.state.user}
                  handleLogInStatus={this.handleLogInStatus}
                />
              ) : (
                <Redirect
                  to={{
                    pathname: "/",
                  }}
                />
              )
            }
          />
          <Route
            exact
            path='/analysis'
            render={(props) => (
              <Analysis
                {...props}
                isSignedIn={this.state.isSignedIn}
                userDetails={this.state.user}
                handleLogInStatus={this.handleLogInStatus}
              />
            )}
          />
          <Route
            exact
            path='/settings'
            render={(props) => (
              <Settings
                {...props}
                isSignedIn={this.state.isSignedIn}
                userDetails={this.state.user}
                handleLogInStatus={this.handleLogInStatus}
                handleUpdateUserDetails={this.handleUpdateUserDetails}
              />
            )}
          />
          <Route component={Notfound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
