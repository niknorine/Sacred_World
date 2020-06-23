const express = require('express');
const router = express.Router();
const passport = require("passport");
const { request } = require('express'); 
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('../config/passport-config')(passport);
const Characters = require('../models/Characters')

const db = mongoose.connection
var MongoClient = require('mongodb').MongoClient
db.on('error', error=> console.error(error))
db.once('open', error=> console.log('connected at users.js'))

const{ authUser } = require('../config/auth')


router.get("/register", (req, res) =>{
    res.render('register.ejs', {query : req.query})    
})

router.get("/admin", authUser, (req, res) =>{
    var login = {}
    if(req.isAuthenticated()){
        res.render('admin.ejs',{
            isLoggedIn: true,
            name: req.user.name
        })
       
    }else{
        res.render('admin.ejs',{
            isLoggedIn: false           
        })
    }
    
})


router.post('/login', (req,res,next) => {    
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);        
})

router.post('/uploadChar', (req, res) => {
    
    //DO SOME ERROR CHECKS BEFORE UPLOADING 
    const { char_name, char_desc } = req.body;
    let errors = []
    if(!char_name){
        errors.push({msg: 'Please enter name'})
    }
    if(!char_desc){
        errors.push({msg: 'Please enter description'})
    }
    if(errors.length > 0){       
        
        res.render('admin.ejs',{
            errors,
            char_name,
            char_desc,
            isLoggedIn: true
        })
    }else{
        Characters.findOne({char_name : char_name})
        .then(character =>{
            if(character){
                errors.push({msg: 'Character with this name already in database'})
                console.log("1")
                res.render('admin.ejs',{                  
                    errors,
                    char_name,
                    char_desc,
                    isLoggedIn: true
                }) 
            }else{
                console.log("2")
                const newCharacter = new Characters({
                    char_name, 
                    char_desc
                })
                newCharacter.save()
                .then(character =>{
                    req.flash('success_msg', 'You have successfully uploaded a character');
                    res.redirect("admin")
                })
                .catch(err => console.log(err));
               
            }
        })
    }

    Characters.findOne({})
    
})

router.get('/logout', (req,res) => {    
    
    request.logOut();        
    req.flash('success_msg', 'Logged out!')
    req.session = null
    res.redirect('/')
    
})

module.exports = router;