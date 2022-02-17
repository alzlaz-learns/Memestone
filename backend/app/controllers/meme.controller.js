const db = require("../models");
const Meme = db.meme;

const getMemes = (req, res) => {
  Meme.findAll().then(memes => {
    /*memes.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });*/
    res.status(200).send(memes);
  });
};

module.exports = {
  getMemes,
};