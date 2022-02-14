const express = require('express');

const router = express.Router();
const Memes = require('../models/registerUser');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const { v4: uuidv4 } = require('uuid');


// display register form
router.get('/register', (req, res) => res.render('register'));
module.exports = router;