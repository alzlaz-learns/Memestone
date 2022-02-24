import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import MemeGallery, {PageType} from './MemeGallery';
import styles from "./css/UserProfile.module.css";
import profilePicture from '../assets/profile.png';
import statsService from "../services/stats.service";

/*
* Profile Page, showing statistics and memes uploaded by a user
* If there is no username specificied in the query (e.g. /profile?user=username), then it shows the currently logged in user
*/
export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      user: { id: null, username: "" },
      numUploads: 0,
      numLikes: 0
    };
  }

  componentDidMount() {
    
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });

    let search = window.location.search;
    let params = new URLSearchParams(search);
    var user = {
      id: null,
      username: params.get("user")
    };

    //If the username is not provided in the query, use the currently logged in user.
    if (user.username === null) {
      user = currentUser;
      this.getUserStats(user.id);
      this.setState({ user: user, userReady: true})
    } else {
      //Retrieve user ID from database
      UserService.getUserID(user.username).then((response) => {
        let id = response.data[0].id;
        this.setState({user: {
            id: id,
            username: params.get("user")
          },
          userReady: true
        });
        this.getUserStats(id);
      });
    }
  }

  //Get user statistics from the database (number of uploads, total number of likes on uploads)
  getUserStats(userID) {
    statsService.getNumLikes(userID).then((response) => {
      var likes = 0;
      for (let i=0; i<response.data.length; i++) {
          likes += response.data[i].likes;
      }
      this.setState({
          numUploads: response.data.length,
          numLikes: likes
      });
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { user, numLikes, numUploads } = this.state;

    return (
      <div className="content" key={Date.now()}>
        {(this.state.userReady) ?
        <div>
        {/* Info bar above gallery */}
        <div className={styles.topBar + " jumbotron"}>
            <img src= {profilePicture} className={styles.profilePicture} alt="User Icon"></img>
            <p className={styles.username}>@{user.username}</p>

            <div className={styles.statsDiv}>
            <p className={styles.rankingLikes}>{numLikes} likes</p>
            <p className={styles.numUploads}>{numUploads} Uploads</p>
            </div>
        </div>

        {/* Meme Gallery */}
        <MemeGallery pageType={PageType.PROFILE} byUser={user.id}></MemeGallery>
        </div>
      : null}
      </div>
    );
  }
}
