const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
var hashmap = require('../config//hashmap');
const session = require('express-session');


//Load the users model
const User = require('../models/User') 

const { authenticate } = require('passport')

module.exports = function(passport) {
    
    passport.use(
        new LocalStrategy ({ usernameField: 'name' }, (name, password, done) => {
            //match user from database
            
            console.log("authenticating: " + name)
            User.findOne({name: name})
                .then(user => {
                    if(!user){
                        return done(null, false, {message: "That username does not exist"})
                    }
                    //Match passwords
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch){                            
                                   
                            
                            return done(null, user);
                        }else{
                            return done(null, false, {message: "Incorrect password"})
                        }
                    } )
                })
                .catch( err => console.log(err))
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(function(id, done){
        User.findById(id,(err, user) => {
            done(err, user)
        })       
    })
}