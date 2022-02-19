const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getUserName = (req, res) => {
  if (req.query.user != null) {
    User.findAll({
      attributes: [
        'username'
      ],
      where: {
        id: req.query.user
      }
    }).then(data => res.status(200).send(data));
  } else res.status(400).send("missing user ID");
};

exports.getUserID = (req, res) => {
  if (req.query.user != null) {
    User.findAll({
      attributes: [
        'id'
      ],
      where: {
        username: req.query.user
      }
    }).then(data => res.status(200).send(data));
  } else res.status(400).send("missing username");
};