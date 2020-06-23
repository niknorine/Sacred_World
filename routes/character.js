const express = require('express')
const router = express.Router();


Characters = require('../models/Characters')
const characters = [];
const User = require('../models/User') 

Characters.find()
    .then(character => {
        character.forEach(char => {
            if(char.isReleased){
                characters.push(char)
            }
        });        
        
    })


router.get("/", (req, res) =>{
    var login = {}
    if(req.isAuthenticated()){
              
        res.render('characters.ejs',{
            isLoggedIn: true,
            user: req.user,
            characters: characters
        })
       
    }else{
        res.render('characters.ejs',{
            isLoggedIn: false,
            characters: characters           
        })
    }
    })




module.exports = router;