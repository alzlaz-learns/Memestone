const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Meme = db.meme;

const getNumLikes = (req, res) => {
  if (req.query.user != null) {
    Meme.findAll({
      attributes: [
        'likes'
        //[sequelize.fn('sum', sequelize.col('likes')), 'num']
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