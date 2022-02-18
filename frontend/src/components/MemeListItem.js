import React, {Component} from "react";
import styles from './css/MemeListItem.module.css';
import InteractionService from "../services/interaction.service";

export default class MemeListItem extends Component {
    rank;

    constructor(props) {
        super(props);

        this.state = {
            currentUser: this.props.currentUser,
            meme: this.props.meme,
            isLiked: 0
        };
    }

    componentDidMount() {
        InteractionService.isMemeLikedBy(this.state.meme.id, this.state.currentUser.username).then((response) => {
            this.setState({isLiked: response.data.length === undefined});
        });
    }

    LikeMeme = () => {
        if (this.state.isLiked) {
            InteractionService.submitDislike(this.state.meme.id, this.state.currentUser.username);
            this.state.meme.likes--;
        } else {
            InteractionService.submitLike(this.state.meme.id, this.state.currentUser.username);
            this.state.meme.likes++;
        }
        this.setState({isLiked: !this.state.isLiked, meme: this.state.meme});
    }

    render() {
        const {
            meme,
            isLiked
          } = this.state;

        return (
            <div class={styles.memeDiv}>
                <img src={meme.url} class={styles.memeImage} alt=""></img>
                <div>
                    {(this.rank) ? <span class={styles.rankNumber}>#{this.rank}</span> : null}
                    <span class={styles.memeUser}>@{meme.poster_id}</span>
                    <span class={styles.memeLikes}>♥ {meme.likes} like{(meme.likes === 1)?"":"s"}</span>
                    <a class={styles.likeButton} onClick={this.LikeMeme}>{(isLiked) ? "unlike" : "like"}</a>
                </div>
            </div>
        );
    }
}