const express = require('express');
const app = express();
var back = require('express-back');

module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'You need to be logged in to view this page!')
        res.redirect('/')
    }
}

function authUser(req,res ,next){
    if(req.user == null){        
        backURL=req.header('Referer') || '/';
        req.flash('error_msg', 'You must be logged in the see this page')
        return res.redirect(backURL);
    }

    next();
}

function authRole(role){
    return(req, res, next) => {
        
        if(req.user.role !== role){
            backURL=req.header('Referer') || '/';
            req.flash('error_msg', 'You can not see this page, you must be a ' + role +' and you are '+ req.user.role+ '.')
            return res.redirect(backURL);
        }
        next()
    }
}

module.exports ={
    authUser,
    authRole
}