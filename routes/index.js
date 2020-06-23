const express = require('express')
const router = express.Router();
const User = require('../models/User') 
const app = express();
const{ authUser, authRole } = require('../config/auth')



router.get("/", (req, res) =>{

    if(req.isAuthenticated()){
        res.render('index.ejs',{
            isLoggedIn: true,
            user: req.user
        })
       
    }else{
        res.render('index.ejs',{
            isLoggedIn: false           
        })
    }    
})


router.get("/settings", (req, res) =>{
     if(req.isAuthenticated()){
        res.render('settings.ejs',{
            isLoggedIn: true,
            user: req.user,            
        })       
    }else{
        res.render('settings.ejs',{
            isLoggedIn: false
           
        })
    }    
})
       
router.get("/friends", authUser, (req, res) =>{
    
    if(req.isAuthenticated()){
        User.findOne({'name': req.user.name}).then(user =>{
            //user.friends.push({status: "fff", user: "sfdfd"})
            //user.save()
            //console.log(user);
            res.render('friends.ejs',{
                isLoggedIn: true,
                user: req.user,
                friends: user.friends
            })
        })
       
       
    }else{        
        res.render('friends.ejs',{
            isLoggedIn: false            
        })
    }
    
})


module.exports = router;