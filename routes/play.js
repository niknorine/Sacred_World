const express = require('express');
const router = express.Router();
const passport = require("passport");
const { request } = require('express');

const{ authUser } = require('../config/auth')


router.get("/matchmake", (req, res) => {
    res.render('matchmake.ejs')    
})

module.exports = router;