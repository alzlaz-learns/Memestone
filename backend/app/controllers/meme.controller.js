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
      }
    }).then(memes => res.status(200).send(memes));
  }
  //Get All Memes
  else Meme.findAll().then(memes => res.status(200).send(memes));
};

module.exports = {
  getMemes
};