import React, {Component} from "react";
import styles from './css/MemeListItem.module.css';
import InteractionService from "../services/interaction.service";
import UserService from "../services/user.service";

export default class MemeListItem extends Component {
    rank;

    constructor(props) {
        super(props);

        this.state = {
            currentUser: this.props.currentUser,
            meme: this.props.meme,
            isLiked: 0,
            username: ""
        };
    }

    componentDidMount() {
        InteractionService.isMemeLikedBy(this.state.meme.id, this.state.currentUser.id).then((response) => {
            this.setState({isLiked: response.data.length === undefined});
        });
        UserService.getUserName(this.state.meme.poster_id).then((response) => {
            this.setState({username: response.data[0].username});
        });
    }

    LikeMeme = () => {
        if (this.state.isLiked) {
            InteractionService.submitDislike(this.state.meme.id, this.state.currentUser.id);
            this.state.meme.likes--;
        } else {
            InteractionService.submitLike(this.state.meme.id, this.state.currentUser.id);
            this.state.meme.likes++;
        }
        this.setState({isLiked: !this.state.isLiked, meme: this.state.meme});
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
                    <span className={styles.memeUser}>@{username}</span>
                    <span className={styles.memeLikes}>♥ {meme.likes} like{(meme.likes === 1)?"":"s"}</span>
                    <a className={styles.likeButton} onClick={this.LikeMeme}>{(isLiked) ? "unlike" : "like"}</a>
                </div>
            </div>
        );
    }
}