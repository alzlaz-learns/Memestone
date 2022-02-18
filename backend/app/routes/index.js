const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");
const memeController = require("../controllers/meme.controller");
const interactionController = require("../controllers/interaction.controller");
const statsController = require("../controllers/stats.controller");
const { authJwt } = require("../middleware");

let routes = (app) => {
  router.post("/upload", fileController.upload);
  router.get("/files", fileController.getListFiles);
  router.get("/files/:name", fileController.download);
  router.get("/api/memes", memeController.getMemes, [authJwt.verifyToken]);
  router.get("/api/likes", interactionController.getLikes, [authJwt.verifyToken]);
  router.post("/api/like", interactionController.submitLike, [authJwt.verifyToken]);
  router.post("/api/dislike", interactionController.submitDislike, [authJwt.verifyToken]);
  router.get("/api/stats/numLikes", statsController.getNumLikes, [authJwt.verifyToken]);

  app.use(router);
};

module.exports = routes;