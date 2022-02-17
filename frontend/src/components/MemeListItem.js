import React, {Component} from "react";
import styles from './css/MemeListItem.module.css';
import MemeService from "../services/meme.service";
import path from 'path';

export default class MemeListItem extends Component {
    rank = 1;
    myProfile = "test";
    meme = {
        url: require("../assets/memes/demomeme.jpg"),
        user: "User",
        likes: 23
    }

    constructor(props) {
        super(props);

        this.state = {
            content: "",
            memes: []
        };

    }

    componentDidMount() {
        const baseUrl = "http://localhost:8080/files/";

        MemeService.getMemes().then((response) => {
            //fix urls to be full paths
            response.data.forEach(function(part, index) {
                part.url = baseUrl + part.url;
            });

            this.setState({
                memes: response.data,
            });
        });
      }

    render() {
        const {
            memes
          } = this.state;

        return (
            <div>
            {memes && memes.map((meme, index) => (
            <div class={styles.memeDiv}>
                <img src={meme.url} class={styles.memeImage} alt=""></img>
                <div>
                    {(this.rank) ?
                    <span class={styles.rankNumber}>#{this.rank}</span> : null}
                    {(this.myProfile) ? null :
                    <span class={styles.memeUser}>@{meme.user}</span>}
                    <span class={styles.memeLikes}>♥ {meme.likes} like{(meme.likes === 1)?"":"s"}</span>
                </div>
            </div>
            ))}
            </div>
        );
    }
}