const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");
const memeController = require("../controllers/meme.controller");
const interactionController = require("../controllers/interaction.controller");
const statsController = require("../controllers/stats.controller");
const { authJwt } = require("../middleware");

let routes = (app) => {
  //Allow user token to be passed in the header
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Allow access to files from URL
  router.get("/files", fileController.getListFiles);
  router.get("/files/:name", fileController.download);
  
  //API interfaces, requiring a valid user token to be sent in the header
  //Meme image upload
  router.post("/upload", [authJwt.verifyToken], fileController.upload);
  //Memes
  router.get("/api/memes", [authJwt.verifyToken], memeController.getMemes);
  //Interaction
  router.get("/api/likes", [authJwt.verifyToken], interactionController.getLikes);
  router.post("/api/like", [authJwt.verifyToken], interactionController.submitLike);
  router.post("/api/dislike", [authJwt.verifyToken], interactionController.submitDislike);
  router.post("/api/markViewed", [authJwt.verifyToken], interactionController.viewMeme);
  router.post("/api/deleteMeme", [authJwt.verifyToken], interactionController.deleteMeme);
  //Stats
  router.get("/api/stats/numLikes", [authJwt.verifyToken], statsController.getNumLikes);

  app.use(router);
};

module.exports = routes;