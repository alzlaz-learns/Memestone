const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");
const memeController = require("../controllers/meme.controller");

let routes = (app) => {
  router.post("/upload", fileController.upload);
  router.get("/files", fileController.getListFiles);
  router.get("/files/:name", fileController.download);
  router.get("/memes", memeController.getMemes);

  app.use(router);
};

module.exports = routes;