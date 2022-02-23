import React, {Component} from "react";
import { Link } from "react-router-dom";
import styles from './css/MemeListItem.module.css';
import InteractionService from "../services/interaction.service";
import UserService from "../services/user.service";
import {PageType} from './MemeGallery';

export default class MemeListItem extends Component {
    removeMeme;
    index;

    constructor(props) {
        super(props);

        this._isMounted = false;
        this.removeMeme = props.removeMeme;
        this.index = props.index;

        this.state = {
            currentUser: this.props.currentUser,
            meme: this.props.meme,
            pageType: this.props.pageType,
            isLiked: 0,
            username: ""
        };
    }

    componentDidMount() {
        this._isMounted = true;
        InteractionService.isMemeLikedBy(this.state.meme.id).then((response) => {
            this._isMounted && this.setState({isLiked: response.data.length === undefined});
        });
        UserService.getUserName(this.state.meme.poster_id).then((response) => {
            this._isMounted && this.setState({username: response.data[0].username});
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    LikeMeme = () => {
        let newMeme = Object.assign({}, this.state.meme);
        if (this.state.isLiked) {
            InteractionService.submitDislike(this.state.meme.id);
            newMeme.likes--;
            if (this.state.pageType === PageType.LIKED_MEMES) this.removeMeme(this.index);
        } else {
            InteractionService.submitLike(this.state.meme.id);
            newMeme.likes++;
        }
        this._isMounted && this.setState({isLiked: !this.state.isLiked, meme: newMeme});
    }

    DeleteMeme = () => {
        InteractionService.deleteMeme(this.state.meme.id);
        
    }

    render() {
        const {
            meme,
            isLiked,
            username
          } = this.state;

        return (
            <div className={styles.memeDiv}>
                <img src={meme.url} className={styles.memeImage} alt=""></img>
                <div>
                    <Link to={"/profile?user="+username}><span className={styles.memeUser}>@{username}</span></Link>
                    <span className={styles.memeLikes}>♥ {meme.likes} like{(meme.likes === 1)?"":"s"}</span>
                    <button className={styles.likeButton} onClick={this.LikeMeme}>{(isLiked) ? "unlike" : "like"}</button>
                    {this.state.currentUser.username === username ?
                    <button className={styles.deleteButton} onClick={this.DeleteMeme}>delete</button>: null }
                </div>
            </div>
        );
    }
}