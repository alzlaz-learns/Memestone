const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");
const memeController = require("../controllers/meme.controller");
const interactionController = require("../controllers/interaction.controller");
const statsController = require("../controllers/stats.controller");

let routes = (app) => {
  router.post("/upload", fileController.upload);
  router.get("/files", fileController.getListFiles);
  router.get("/files/:name", fileController.download);
  router.get("/api/memes", memeController.getMemes);
  router.get("/api/likes", interactionController.getLikes);
  router.post("/api/like", interactionController.submitLike);
  router.post("/api/dislike", interactionController.submitDislike);
  router.get("/api/stats/numLikes", statsController.getNumLikes);

  app.use(router);
};

module.exports = routes;