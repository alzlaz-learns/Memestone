import React, { useState, useRef, useEffect } from "react";
import AuthService from "../services/auth.service";
import MemeService from "../services/meme.service";
import styles from "./css/TinderCards.module.css";
import TinderCard from "react-tinder-card";
import UserService from "../services/user.service";
import InteractionService from "../services/interaction.service";

var db = []

/*
* SwipeComponent is the home page when a user is currently logged in.
* Displays a list of recent memes to a user to swipe through in the form of dating app-style cards
*/
function SwipeComponent() {
  const baseUrl = "http://localhost:8080/files/";

  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [usernames] = useState([]);
  var currentUser = AuthService.getCurrentUser();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const [childRefs, setChildRefs] = useState(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )
  
  //Get list of memes from database
  useEffect(() => {
    MemeService.getNewMemesFor(currentUser.id).then((response) => {
      db = response.data;

      //Fix meme image urls urls to be full paths
      response.data.forEach(function(part, index) {
        part.url = baseUrl + part.url;

        //Usernames fetched from service can either be of type promise (for database polling) or string (if cached)
        let serviceResponse = UserService.getUserName(part.poster_id);
        if (serviceResponse instanceof Promise) serviceResponse.then((response) => { //Load from database
            usernames[index] = response.data[0].username;
            if (index === db.length - 1) updateCardReferences();
        });
        else { //Load from cache
          usernames[index] = serviceResponse;
          if (index === db.length - 1) updateCardReferences();
        }
      });
    });
  }, []);

  //Update card references
  const updateCardReferences = () => {
    setCurrentIndex(db.length - 1);
    setChildRefs(() =>
      Array(db.length)
      .fill(0)
      .map(() => React.createRef()),
    []);
  }

  //Update current index in meme list
  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < db.length - 1
  const canSwipe = currentIndex >= 0

  //Set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    currentUser = AuthService.getCurrentUser();
    if (!currentUser) alert("logged out");
    updateCurrentIndex(index - 1);

    let meme = db[index];
    if (direction === "right") {
      //Swipe right likes the current meme
      InteractionService.submitLike(meme.id);
    } else {
      //Swipe left dislikes the current meme
      InteractionService.submitDislike(meme.id);
    }
    //Mark this meme as viewed so it will not be shown again
    InteractionService.markViewed(meme.id);
  }

  //Called when a card leaves the frame
  const outOfFrame = (name, idx) => {
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
  }

  //Swipes a card (used by buttons)
  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  //Increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  return (
    <div className="content">
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
        <div className={styles.cardContainer}>
          {db.map((meme, index) => (
            <TinderCard
              ref={childRefs[index]}
              className={styles.swipe}
              key={index}
              preventSwipe={["up", "down"]}
              onSwipe={(dir) => swiped(dir, meme.name, index)}
              onCardLeftScreen={() => outOfFrame(meme.name, index)}
            >
              <div className={styles.card}>
                <img src={meme.url} className={styles.cardImage} alt={usernames[index] + "'s meme"}></img>
                <h3>@{usernames[index]}</h3>
                <h3 className={styles.memeLikes}>♥ {meme.likes} like{(meme.likes === 1)?"":"s"}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
        <div className={styles.buttons}>
          <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Dislike Meme</button>
          <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Go Back</button>
          <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Like Meme</button>
        </div>
    </div>
  )
}

export default SwipeComponent;