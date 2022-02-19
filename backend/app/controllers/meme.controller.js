const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Meme = db.meme;

const getMemes = (req, res) => {
  //Top Memes (/api/memes?top)
  if (req.query.top != null) {
    Meme.findAll({
      order: [
        ['likes', 'DESC'],
        ['updatedAt', 'DESC']
      ]
    }).then(memes => res.status(200).send(memes));
  }
  //By User (/api/memes?byUser='userID')
  else if (req.query.byUser != null) {
    Meme.findAll({
      where: {
        poster_id: req.query.byUser
      }
    }).then(memes => res.status(200).send(memes));
  }
  //Liked Memes (/api/memes?likedBy='userID')
  else if (req.query.likedBy) {
    Meme.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: sequelize.literal("(select memeID from likes where userID="+req.query.likedBy+")")
        }
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    }).then(memes => res.status(200).send(memes));
  }
  //Get front page memes for a given user (/api/memes?newMemesFor='userID')
  else if (req.query.newMemesFor) {
    Meme.findAll({
      where: {
        poster_id: {
          [Sequelize.Op.not]: req.query.newMemesFor
        }
      },
      order: [
        ['createdAt', 'DESC']
      ]
    }).then(memes => res.status(200).send(memes));
  }
  //Get All Memes
  else Meme.findAll().then(memes => res.status(200).send(memes));
};

module.exports = {
  getMemes
};