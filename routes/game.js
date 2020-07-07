const express = require('express')
const router = express.Router();
const User = require('../models/User') 
const app = express();
const{ authUser, authRole } = require('../config/auth')
const mongoose = require("mongoose")
const Characters = require('../models/Characters')
const db = mongoose.connection
db.on('error', error=> console.error(error))
db.once('open', error=> console.log('connected at users.js'))

const http = require('http').createServer(express)
const io = require('socket.io')(http);
let players = [];


let whosTurn = "player1"

//THIS IS THE SERVER SIDE


//THIS IS WHERE WE SET UP THE FUNCTIONS. socket.on.emit TO SEND TO THE PERSON WHO REQUESTED IT
//IO.EMIT SEND TO ALL
//BROADCAST MEANS SEND DATA TO EVERYONE EXCEPT THE USER REQUESTING


io.on('connection', function (socket){
    console.log('A user connected ' + socket.id);

    Characters.find()
    .then(character =>{  
        socket.emit("ShowCharacters", character);
        
    })  

   

    socket.on('disconnect', function(){
        console.log('User disconnect ' + socket.id)
        players = players.filter(player => player !== socket.id)
    })

    socket.on("endTurn", function(skillsUsed){
        if(whosTurn === "player1"){
            whosTurn = "player2"
        }else{
            whosTurn = "player1"
        }
        io.emit("nextTurn", whosTurn, skillsUsed)
    })
    
    players.push(socket.id);
    let player1 = [players[0]];
    let player2 = [players[1]];

    
    //First person to connect is player1
    if(players.length === 1){
        io.emit('isPlayerA');
    }
    
    //once both players are connected
    if(players.length === 2){
        console.log("heree")
        io.emit('playersConnected')
        console.log("sss")
        console.log(io.clients())
        io.emit('updateEnergy')
    }



    

    socket.on("clickSkill", function(skill, character) {          
        socket.emit("selectSkill", whosTurn, skill, character)
    })

    socket.on("use", function(skill, characterToUseOn){
        
            socket.emit("use", skill, characterToUseOn)
            
        
    })

    socket.on("getEnemyTurn", function(effectArray){
        socket.broadcast.emit("sendEffectData", effectArray) 
    })

    socket.on("getFromDataBase", function(char){
        Characters.findOne({char_name : char.name})
        .then(character =>{  
            socket.emit("gotData",character);
        })  
    })

    socket.on("calculateDamage", function(skill, effect){
        io.emit("returnCalculated", calculateDamage(skill, effect))
    })

    function calculateDamage(effect, characterToUseOn){
        console.log("test 123" + JSON.stringify(characterToUseOn))
        console.log(JSON.stringify("Used " + effect.name+ " on "+ characterToUseOn.charNumber))     
        
        
        //This is where we should calculate the damage and shit
        // We should probably add a check for damage reduction but i cba atm

        return {
            damage: effect.effect.damage,
            charToUseOn: characterToUseOn.charNumber
        }
    }


})



http.listen(1000, function () {
    console.log('iosocket started')
})






router.get("/", authUser,(req, res) => {
    if(req.isAuthenticated()){
        user = req.user
        res.render('client/index.ejs',{       
            isLoggedIn: true,
            user: user
        })
        }    
})


module.exports = router;