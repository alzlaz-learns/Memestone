const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");
const memeController = require("../controllers/meme.controller");
const interactionController = require("../controllers/interaction.controller");
const statsController = require("../controllers/stats.controller");
const { authJwt } = require("../middleware");

let routes = (app) => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/upload", fileController.upload, [authJwt.verifyToken]);
  router.get("/files", fileController.getListFiles, [authJwt.verifyToken]);
  router.get("/files/:name", fileController.download, [authJwt.verifyToken]);
  router.get("/api/memes", memeController.getMemes, [authJwt.verifyToken]);
  router.get("/api/likes", interactionController.getLikes, [authJwt.verifyToken]);
  router.post("/api/like", interactionController.submitLike, [authJwt.verifyToken]);
  router.post("/api/dislike", interactionController.submitDislike, [authJwt.verifyToken]);
  router.get("/api/stats/numLikes", statsController.getNumLikes, [authJwt.verifyToken]);

  app.use(router);
};

module.exports = routes;