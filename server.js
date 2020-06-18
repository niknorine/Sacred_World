if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

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

const { request } = require('http');
const users = [];

const initializePassport = require("./passport-config")
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.set("view-engine","ejs")
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
    if(req.isAuthenticated()){
        res.render('index.ejs', {name: req.user.name})
    }else{
        res.render('index.ejs', {name: 'Not logged in'})
    }
    
})

app.get("/login", (req, res) =>{
    res.render('login.ejs')
})

app.get("/register", (req, res) =>{
    res.render('register.ejs')
    
})



app.post("/register", async (req, res) => {
    console.log('test');
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword           
        })
        res.redirect('/login')
    } catch{
        res.redirect('/register')
    }
    console.log(users)
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

