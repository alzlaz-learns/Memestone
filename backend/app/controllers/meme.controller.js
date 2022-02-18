const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Meme = db.meme;
const Likes = db.likes;

const getMemes = (req, res) => {
  //Top Memes (/memes?top)
  if (req.query.top != null) {
    Meme.findAll({
      order: [
        ['likes', 'DESC']
      ]
    }).then(memes => res.status(200).send(memes));
  }
  //By User (/memes?byUser='username')
  else if (req.query.byUser != null) {
    Meme.findAll({
      where: {
        poster_id: req.query.byUser
      }
    }).then(memes => res.status(200).send(memes));
  }
  //Liked Memes (/memes?likedBy='username')
  else if (req.query.likedBy) {
    Meme.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: sequelize.literal("(select memeID from likes where username='"+req.query.likedBy+"')")
        }
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    }).then(memes => res.status(200).send(memes));
  }
  //Whether a given meme is liked by a user (/memes?isLiked=meme_ID&user='username')
  else if (req.query.isLiked) {
    if (req.query.user) {
      Likes.findOne({
        where: {
          username: req.query.user,
          memeID: req.query.isLiked
        }
      }).then(memes => res.status(200).send(memes));
    } else res.status(400).send("missing user parameter");
  }
  //Get All Memes
  else Meme.findAll().then(memes => res.status(200).send(memes));
};

module.exports = {
  getMemes
};