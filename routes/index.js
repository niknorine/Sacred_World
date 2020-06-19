const express = require('express')
const router = express.Router();



router.get("/", (req, res) =>{
    var login = {}
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
    var login = {}
    if(req.isAuthenticated()){
        res.render('settings.ejs',{
            isLoggedIn: true,
            user: req.user
        })
       
    }else{
        res.render('settings.ejs',{
            isLoggedIn: false
           
        })
    }
    
})


router.get("/friends", (req, res) =>{
    var login = {}
    if(req.isAuthenticated()){
        res.render('friends.ejs',{
            isLoggedIn: true,
            user: req.user
        })
       
    }else{
        res.render('friends.ejs',{
            isLoggedIn: false
           
        })
    }
    
})


module.exports = router;