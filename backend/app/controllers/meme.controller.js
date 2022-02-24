const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Meme = db.meme;

//Retrieve a list of memes from the database
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
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    }).then(memes => res.status(200).send(memes));
  }
  //Liked Memes (/api/memes?liked)
  else if (req.query.liked != null) {
    console.log(req.userId);
    Meme.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: sequelize.literal("(select memeID from likes where userID="+req.userId+")")
        }
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    }).then(memes => res.status(200).send(memes));
  }
  //Get front page memes for a given user (/api/memes?newMemesFor='userID')
  else if (req.query.newMemesFor != null) {
    Meme.findAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: sequelize.literal("(select memeID from viewed where userID="+req.userId+")")
        },
        poster_id: {
          [Sequelize.Op.not]: req.userId
        }
      },
      order: [
        ['createdAt', 'ASC']
      ]
    }).then(memes => res.status(200).send(memes));
  }
  //Get All Memes
  else Meme.findAll().then(memes => res.status(200).send(memes));
};

module.exports = {
  getMemes
};