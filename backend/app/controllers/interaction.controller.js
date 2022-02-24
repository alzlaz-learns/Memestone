const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Meme = db.meme;
const Likes = db.likes;
const Viewed = db.viewed;

//Check if a meme is liked by the current user
const getLikes = (req, res) => {
  if (req.query.meme) {
      Likes.findOne({
        where: {
          userID: req.userId,
          memeID: req.query.meme
        }
      }).then(memes => res.status(200).send(memes));
  } else res.status(400).send("missing meme parameter");
};

//Submit a like for a specific meme on the server
const submitLike = async (req, res) => {
  const entry = await Likes.findOne({
    where: {
      userID: req.userId,
      memeID: req.body.meme
    }
  });

  if (entry === null) { //Not already liked
    Likes.create({
      userID: req.userId,
      memeID: req.body.meme
    });
    //Increment like count for meme
    Meme.increment('likes', {by: 1, where: { id: req.body.meme }});
  }
}

//Submit a dislike for a specific meme on the server
const submitDislike = async (req, res) => {
  const entry = await Likes.findOne({
    where: {
      userID: req.userId,
      memeID: req.body.meme
    }
  });

  if (entry !== null) { //Already liked
    Likes.destroy({
      where: {
        userID: req.userId,
        memeID: req.body.meme
      }
    });
    //Decrement like count for meme
    Meme.decrement('likes', {by: 1, where: { id: req.body.meme }});
  }
}

const viewMeme = async (req, res) => {
  //Mark meme as viewed
  Viewed.findOrCreate({
    where: {
      userID: req.userId,
      memeID: req.body.meme
    },
    defaults: {
      userID: req.userID,
      memeID: req.body.meme
    }
  });
}

//Delete a meme from the database
const deleteMeme = async (req, res) => {
  Meme.destroy({
    where: {
      poster_id: req.userId,
      id: req.body.meme
    }
  }).then(() => {
    //Remove references from likes table if the delete succeeded
    Likes.destroy({
      where: {
        memeID: req.body.meme
      }
    })
  });
}

module.exports = {
  getLikes,
  submitLike,
  submitDislike,
  viewMeme,
  deleteMeme
};