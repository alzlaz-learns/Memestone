import React, {Component} from "react";
import styles from './css/MemeListItem.module.css';

export default class MemeListItem extends Component {
    rank;

    constructor(props) {
        super(props);

        this.state = {
            meme: this.props.meme
        };

    }

    render() {
        const {
            meme
          } = this.state;

        return (
            <div class={styles.memeDiv}>
                <img src={meme.url} class={styles.memeImage} alt=""></img>
                <div>
                    {(this.rank) ?
                    <span class={styles.rankNumber}>#{this.rank}</span> : null}
                    <span class={styles.memeUser}>@{meme.poster_id}</span>
                    <span class={styles.memeLikes}>♥ {meme.likes} like{(meme.likes === 1)?"":"s"}</span>
                </div>
            </div>
        );
    }
}