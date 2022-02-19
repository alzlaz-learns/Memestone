import React, { Component } from "react";
import styles from "./css/MemeMaker.module.css";
import AuthService from "../services/auth.service";
import UploadService from "../services/file-upload.service";

const Meme = ({memeTemplate, onClick}) => {
    return(
        <img className={styles.meme} key={memeTemplate.id} src={memeTemplate.url} alt={memeTemplate.name} onClick={onClick}/>
    )
}

export default class MemeMaker extends Component{

    constructor(props) {
        super(props);

        this.state = {
            allMemes: [],
            memeTemplate: null,
            topText: "",
            bottomText: "",
            meme: null,
            currentUser: null,
            userReady: false
        };
    }

    componentDidMount() {
        fetch("https://api.imgflip.com/get_memes").then(x =>
            x.json().then(response => this.setState({allMemes: response.data.memes}))
        );
        this.setState({currentUser: AuthService.getCurrentUser(), userReady: true});
    }

    objectToQueryParam = obj => {
        const parameters = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
        return "?" + parameters.join("&");
      };

  render() {
    const {
        allMemes,
        memeTemplate,
        topText,
        bottomText,
        meme,
        currentUser,
        userReady
    } = this.state;

    if (!userReady) return (<div></div>);

    if (meme) {
        return (
          <div className="jumbotron">
              <h3>Meme created!</h3>
            <img style={{ width: 200 }} src={meme} alt="custom meme" />
            <button className="btn btn-link" onClick={() => {this.setState({memeTemplate: null, meme: null})}}>Start over</button>
          </div>
        );
      }

  return (
    <div className="jumbotron">
        <h3>Meme Templates</h3>
      {memeTemplate && (
        <form
          onSubmit={async e => {
            e.preventDefault();
            // add parameters to create meme from imgflip api
            const parameters = {
              template_id: memeTemplate.id,
              text0: topText,
              text1: bottomText,
              username: "redherringteam",
              password: "redherring123"
            };

            //Calls imgflip api and uses objectToQueryParam above to create API call
            const response = await fetch(
              `https://api.imgflip.com/caption_image${this.objectToQueryParam(
                parameters
              )}`
            );
            const json = await response.json();
            fetch(json.data.url)
                .then(res => res.blob())
                .then(blob => {
                    blob.name = Math.random()+".jpg";
                UploadService.upload(blob, {
                    id: currentUser.id,
                    username: currentUser.username,
                    filename: "imgflip.jpg"
                  });
                
                });
            this.setState({meme: json.data.url});
          }}
          //Sets top and bottom text for the meme
        >
        <button className="btn btn-link" onClick={() => {this.setState({memeTemplate:null})}}>Go back</button>
        <div className="form-group">
          
          <Meme memeTemplate={memeTemplate} />
          <input
            placeholder="top text"
            value={topText}
            className="form-control"
            onChange={e => this.setState({topText: e.target.value})}
          />
          <input
            placeholder="bottom text"
            value={bottomText}
            className="form-control"
            onChange={e => this.setState({bottomText: e.target.value})}
          />
          <button type="submit" className="btn btn-primary">Create meme!</button>
          </div>
        </form>
      )}
      
      {!memeTemplate && (
        <>
          {allMemes.slice(0,100).map(memeTemplate => {
            return (
              <Meme
                memeTemplate={memeTemplate}
                onClick={() => {
                    this.setState({memeTemplate: memeTemplate});
                }}
              key={memeTemplate.id}/>
            );
          })}
        </>
      )}
      <p>Meme Templates provided by <a href="https://imgflip.com/" target="blank">imgflip.com</a></p>
    </div>
    // Home page which calls all pre-template memes from imgflip meme creator ^
  );
        }
}