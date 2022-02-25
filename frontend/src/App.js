import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import LikedMemes from "./components/LikedMemes";
import TopRanked from "./components/TopRanked";



import "bootstrap/dist/css/bootstrap.min.css";


import EventBus from "./common/EventBus";

class App extends Component {
  keyInc = Math.random()*100;

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    window.addEventListener('storage', (event) => {
      if(event.newValue == null) {
        window.location.reload(false);
      }
    });
    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    // localStorage.setItem('user', null);//here
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  getKey() {
    return this.keyInc++;
  }

  render() {
    const { currentUser} = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            MemeStone
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item" key={this.getKey()}>
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {/* Account-Locked options */}
            {currentUser && ([
              <li className="nav-item" key={this.getKey()}>
                <Link to={"/new"} className="nav-link">New Meme</Link>
              </li>,
              <li className="nav-item" key={this.getKey()}>
                <Link to={"/top"} className="nav-link">Top Ranked</Link>
              </li>,
              <li className="nav-item" key={this.getKey()}>
                <Link to={"/liked"} className="nav-link">Liked Memes</Link>
              </li>

            ])}
          </div>

          {/* Account/Logout controls */}
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item" key={this.getKey()}>
                <Link to={"/profile"} className="nav-link">{currentUser.username}</Link>
              </li>
              <li className="nav-item" key={this.getKey()}>
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item" key={this.getKey()}>
                <Link to={"/login"} className="nav-link">Login</Link>
              </li>

              <li className="nav-item" key={this.getKey()}>
                <Link to={"/register"} className="nav-link">Sign Up</Link>
              </li>
            </div>
          )}
        </nav>

        <div>
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/new" component={BoardUser} />
            <Route exact path="/top" component={TopRanked} />
            <Route exact path="/liked" component={LikedMemes} />
            
          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
  }
}

export default App;
