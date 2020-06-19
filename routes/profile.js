const express = require('express')
const router = express.Router();



router.get("/", (req, res) =>{
    var login = {}
    if(req.isAuthenticated()){
        res.render('profile.ejs',{
            isLoggedIn: true,
            name: req.user.name
        })
       
    }else{
        res.render('profile.ejs',{
            isLoggedIn: false
           
        })
    }
    
})


module.exports = router;