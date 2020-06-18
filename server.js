if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

var uniqid = require('uniqid');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error=> console.error(error))
db.once('open', error=> console.log('connected'))

var MongoClient = require('mongodb').MongoClient




const { request } = require('http');


const initializePassport = require("./passport-config");
const { doesNotMatch } = require('assert');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.set("view-engine","ejs")
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())



app.get("/", (req, res) =>{
    var login = {}
    if(req.isAuthenticated()){
        res.render('index.ejs',{
            isLoggedIn: true,
            name: req.user.name
        })
       
    }else{
        res.render('index.ejs',{
            isLoggedIn: false
           
        })
    }
    
})

app.get("/login", (req, res) =>{
    res.render('login.ejs')
})

app.get("/header", (req, res)=> {
       
    
    
})

app.get("/register", (req, res) =>{
    res.render('register.ejs', {query : req.query})
    
})



app.post("/register", async (req, res) => {
     
    try{
        if(req.body.password != req.body.repeat_password){
            res.redirect('/register?error=badpasswrod')
        }   
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        user = ({
            id: uniqid().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword           
        })
        
    } catch{
        res.redirect('/register')
    }

    

    MongoClient.connect(process.env.DATABASE_URL,{ useUnifiedTopology: true}, function(err, db) {        
        if (err) throw err;
        var dbo = db.db("sacredworld");
        var $or = [ { name : req.body.name } ];       

        dbo.collection("users").findOne({$or : $or}, function(err, result) {
            
            if (err) throw err;
            if(result==null){                 
                         
                console.log('no user');                
                dbo.collection("users").find({users:{$elemMatch: {email: user.email}}}, function(err, result) {
                    if (err) throw err;
                    if(result == null){ 
                        console.log(result)
                        console.log('no email');                       
                        dbo.collection("users").insertOne(user, function(err, data) {
                            if (err) throw err;
                        console.log("1 document inserted");  
                        
                            res.redirect('/login')  
                        }) 
                    
                    }else if(result != null){
                        console.log('email taken')                
                        var string = encodeURIComponent('emailtaken');
                        res.redirect('/register?error=' + string)
                    }
                })
            }else if(result != null){
                console.log('user taken')                
                var string = encodeURIComponent('usertaken');
                res.redirect('/register?error=' + string)
                              
            }                      
          });
      });
})

app.post("/login", passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
}))

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

app.listen(process.env.PORT || 5000)

