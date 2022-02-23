import React, {Component} from "react";
import { Link } from "react-router-dom";
import styles from './css/MemeListItem.module.css';
import InteractionService from "../services/interaction.service";
import UserService from "../services/user.service";

export default class MemeListItem extends Component {
    rank;

    constructor(props) {
        super(props);

        this._isMounted = false;

        this.state = {
            currentUser: this.props.currentUser,
            meme: this.props.meme,
            isLiked: 0,
            username: ""
        };
    }

    componentDidMount() {
        this._isMounted = true;
        InteractionService.isMemeLikedBy(this.state.meme.id, this.state.currentUser.id).then((response) => {
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
            InteractionService.submitDislike(this.state.meme.id, this.state.currentUser.id);
            newMeme.likes--;
        } else {
            InteractionService.submitLike(this.state.meme.id, this.state.currentUser.id);
            newMeme.likes++;
        }
        this._isMounted && this.setState({isLiked: !this.state.isLiked, meme: newMeme});
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
                    {(this.rank) ? <span className={styles.rankNumber}>#{this.rank}</span> : null}
                    <Link to={"/profile?user="+username}><span className={styles.memeUser}>@{username}</span></Link>
                    <span className={styles.memeLikes}>♥ {meme.likes} like{(meme.likes === 1)?"":"s"}</span>
                    <button className={styles.likeButton} onClick={this.LikeMeme}>{(isLiked) ? "unlike" : "like"}</button>
                </div>
            </div>
        );
    }
}