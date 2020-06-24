const express = require('express')
const router = express.Router();
const User = require('../models/User') 
const app = express();
const{ authUser, authRole } = require('../config/auth')

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

    socket.on('disconnect', function(){
        console.log('User disconnect ' + socket.id)
        players = players.filter(player => player !== socket.id)
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



    

    socket.on("clickSkill", function(skill) {  
        console.log(skill)
        if(whosTurn == "player1"){
            io.to(player1).emit("selectSkill", whosTurn, skill)
            //io.emit("useSkill", whosTurn)
        }      
        
    })

    socket.on("use", function(skill, characterToUseOn){
        if(whosTurn == "player1"){
            io.to(player1).emit("use", skill, characterToUseOn)
            console.log(JSON.stringify(skill))
        }
    })



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