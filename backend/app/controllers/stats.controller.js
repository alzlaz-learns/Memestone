const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Meme = db.meme;

//Get a list of like counts for a user, used for sum total number of likes as well as number of memes uploaded
const getNumLikes = (req, res) => {
  if (req.query.user != null) {
    Meme.findAll({
      attributes: [
        'likes'
      ],
      where: {
        poster_id: req.query.user
      }
    }).then(data => res.status(200).send(data));
  }else res.status(400).send("missing user parameter");
};

module.exports = {
  getNumLikes
};