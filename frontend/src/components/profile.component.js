import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import MemeGallery, {PageType} from './MemeGallery';
import styles from "./css/UserProfile.module.css";
import profilePicture from '../assets/profile.png';
import statsService from "../services/stats.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      numUploads: 0,
      numLikes: 0
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser)
    statsService.getNumLikes(currentUser.username).then((response) => {
        var likes = 0;
        for (var i=0; i<response.data.length; i++) {
            likes += response.data[i].likes;
        }
        this.setState({
            numUploads: response.data.length,
            numLikes: likes
        });
    });

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true})
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser, numLikes, numUploads } = this.state;

    return (
      <div className="content">
        {(this.state.userReady) ?
        <div>
        {/* Info bar above gallery */}
        <div className={styles.topBar}>
            <img src= {profilePicture} class={styles.profilePicture} alt="User Icon"></img>
            <p class={styles.username}>@{currentUser.username}</p>

            <div class={styles.statsDiv}>
            <p class={styles.rankingLikes}>{numLikes} likes</p>
            <p class={styles.numUploads}>{numUploads} Uploads</p>
            </div>

            <Link to="/make" class={styles.uploadButton}>New Meme</Link>
        </div>

        {/* Meme Gallery */}
        <MemeGallery pageType={PageType.PROFILE}></MemeGallery>
        </div>
      : null}
      </div>
    );
  }
}
