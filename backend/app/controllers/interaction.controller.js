const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Meme = db.meme;
const Likes = db.likes;

const getLikes = (req, res) => {
  if (req.query.meme) {
    if (req.query.user) {
      Likes.findOne({
        where: {
          userID: req.query.user,
          memeID: req.query.meme
        }
      }).then(memes => res.status(200).send(memes));
    } else res.status(400).send("missing user parameter");
  }
};

const submitLike = async (req, res) => {
  const entry = await Likes.findOne({
    where: {
      userID: req.body.userID,
      memeID: req.body.meme
    }
  });

  if (entry === null) { //Not already liked
    Likes.create({
      userID: req.body.userID,
      memeID: req.body.meme
    });
    //Increment like count for meme
    Meme.increment('likes', {by: 1, where: { id: req.body.meme }});
  }
}

const submitDislike = async (req, res) => {
  const entry = await Likes.findOne({
    where: {
      userID: req.body.userID,
      memeID: req.body.meme
    }
  });

  if (entry !== null) { //Already liked
    Likes.destroy({
      where: {
        userID: req.body.userID,
        memeID: req.body.meme
      }
    });
    //Decrement like count for meme
    Meme.decrement('likes', {by: 1, where: { id: req.body.meme }});
  }
}

module.exports = {
  getLikes,
  submitLike,
  submitDislike
};