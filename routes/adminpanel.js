const express = require('express');
const router = express.Router();
const passport = require("passport");
const { request } = require('express');
const { ROLE } = require('../config/role')
const app = express();
var hashmap = require('../config//hashmap');

const{ authUser, authRole } = require('../config/auth')

app.use(express.static(__dirname + '/public/admin'));

router.get("/dashboard", authUser, authRole(ROLE.ADMIN), (req, res) => {
    res.render('dashboard.ejs')
    console.log(hashmap.auth.all());    
})

module.exports = router;