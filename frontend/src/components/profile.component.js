import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import MemeGallery, {PageType} from './MemeGallery';
import styles from "./css/UserProfile.module.css";
import profilePicture from '../assets/profile.png';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <div className="content">
        {(this.state.userReady) ?
        <div>
        {/* Info bar above gallery */}
        <div className={styles.topBar}>
            <img src= {profilePicture} class={styles.profilePicture} alt="User Icon"></img>
            <p class={styles.username}>@{currentUser.username}</p>

            <div class={styles.statsDiv}>
            <p class={styles.rankingLikes}>23 likes</p>
            <p class={styles.numUploads}>6 Uploads</p>
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
