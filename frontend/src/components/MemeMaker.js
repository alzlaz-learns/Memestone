import React, { useState, useEffect } from "react";
import styles from "./css/MemeMaker.module.css";
import AuthService from "../services/auth.service";
import UploadService from "../services/file-upload.service";

//Turns all parameters into link that can communicate with imgflip API
const objectToQueryParam = obj => {
    const parameters = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
    return "?" + parameters.join("&");
  };

const Meme = ({memeTemplate, onClick}) => {
    return(
        <img className={styles.meme} key={memeTemplate.id} src={memeTemplate.url} alt={memeTemplate.name} onClick={onClick}/>
    )
}

function MemeMaker(props) {
    const [allMemes, setAllMemes] = useState([]);
  const [memeTemplate, setTemplate] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [meme, setMeme] = useState(null);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes").then(x =>
      x.json().then(response => setAllMemes(response.data.memes))
    );
  }, []);
  //TO BE CONTINUED BELOW
  if (meme) {
    return (
      <div className="jumbotron">
          <h3>Meme created!</h3>
        <img style={{ width: 200 }} src={meme} alt="custom meme" />
        <button className="btn btn-link" onClick={() => {setTemplate(null); setMeme(null);}}>Start over</button>
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
              `https://api.imgflip.com/caption_image${objectToQueryParam(
                parameters
              )}`
            );
            const json = await response.json();
            fetch(json.data.url)
                .then(res => res.blob())
                .then(blob => {
                    blob.name = Math.random()+".jpg";
                UploadService.upload(blob, currentUser);
                });
            setMeme(json.data.url);
          }}
          //Sets top and bottom text for the meme
        >
        <button className="btn btn-link" onClick={() => {setTemplate(null)}}>Go back</button>
        <div className="form-group">
          
          <Meme memeTemplate={memeTemplate} />
          <input
            placeholder="top text"
            value={topText}
            className="form-control"
            onChange={e => setTopText(e.target.value)}
          />
          <input
            placeholder="bottom text"
            value={bottomText}
            className="form-control"
            onChange={e => setBottomText(e.target.value)}
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
                  setTemplate(memeTemplate);
                }}
              />
            );
          })}
        </>
      )}
      <p>Meme Templates provided by <a href="https://imgflip.com/" target="blank">imgflip.com</a></p>
    </div>
    // Home page which calls all pre-template memes from imgflip meme creator ^
  );
}

export default MemeMaker;