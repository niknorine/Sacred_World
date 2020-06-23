if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const router = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoStore = require('connect-mongo')(session)
var back = require('express-back');




var cookieSession = require('cookie-session');

require('./config/passport-config')(passport);
mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const db = mongoose.connection
var MongoClient = require('mongodb').MongoClient
db.on('error', error=> console.error(error))
db.once('open', error=> console.log('connected'))

   

const User = require('./models/User')
const initializePassport = require("./config/passport-config");
const { request } = require('http');
const{ authUser, authRole } = require('./config/auth')
const { doesNotMatch } = require('assert');
const { MongoStore } = require('connect-mongo');
const { Http2ServerRequest } = require('http2');

app.use(bodyParser());

app.use(cookieSession({
    secret: 'secret',
    signed: true,
    
  }));

app.use(back());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
      
}))

app.use(passport.initialize())

app.use(passport.session())

app.use(flash());

app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', require('./routes/index'))


app.use('/profile', require('./routes/profile'))

app.use('/users', require('./routes/users'))

app.use('/play', require('./routes/play'))

app.use('/adminpanel', require('./routes/adminpanel'))

app.use('/game', require('./routes/game'))

app.use('/characters', require('./routes/character'))

app.set("view-engine","ejs")

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false}))

app.use(express.json())



//To register. We can probably move this to another file. but im too lazy atm
app.post("/register", (req, res) => {     
    const { name, email, password, repeat_password } = req.body;

    let errors = []
    if(!name){
        errors.push({msg: 'Please enter name'})
    }
    if(!email){
        errors.push({msg: 'Please enter email'})
    }
    if(!password){
        errors.push({msg: 'Please enter password'})
    }
    if(!repeat_password){
        errors.push({msg: 'Please repeat password'})
    }

    if(password != repeat_password){
        errors.push({msg: 'Passwords do not match'})
    }

    if(password.length < 4){
        errors.push({msg: 'Password too short'})
    }

    if(name )

    if(errors.length > 0){
        //error in creating user
        res.render('register.ejs',{
            query : req.query,
            errors,
            name,
            email
        })
    }else{
        //Create user here
        User.findOne({email: email})
            .then(user => {
                if(user){
                    errors.push({msg: "Account with email already created"})
                    //Username already exists
                    res.render('register.ejs',{
                        query : req.query,
                        errors,
                        name,
                        email
                    })
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hashing Password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;   
                                          
                        newUser.save()
                            .then(user =>{                                
                                req.flash('success_msg', 'You have successfully registered. Please log-in!');
                                res.redirect("/")
                            })
                            .catch(err => console.log(err));
                    }))
                } 
            });
    }
})





app.listen(process.env.PORT || 5000)

