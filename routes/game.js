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

var clients =[];


//THIS IS THE SERVER SIDE


//THIS IS WHERE WE SET UP THE FUNCTIONS. socket.on.emit TO SEND TO THE PERSON WHO REQUESTED IT
//IO.EMIT SEND TO ALL
//BROADCAST MEANS SEND DATA TO EVERYONE EXCEPT THE USER REQUESTING







io.on('connection', function (socket){
    

    socket.on('newplayer',function(){
        console.log("horray " + socket.id)
        socket.emit("getId",  socket.id)
    })


    socket.on('storeClientInfo', function (data) {
        let dataParse = JSON.parse(data)
        console.log(dataParse.name)
        socket.emit("sendData", dataParse)
    });


    socket.emit('socketId', socket.id)
    socket.on("joinMainRoom", function(){
        socket.join("mainRoom")
        socket.leave(socket.id)        
    })

    socket.on("test1", (user) =>{
        clientData = JSON.parse(user)        
        socket.clientUsername = clientData.name
        console.log("id: "+ socket.id + "   username: " + socket.clientUsername)
        
    })
    
    console.log(io.sockets.adapter.rooms)
    
    console.log('A user connected ' + socket.id);
    

    Characters.find()
    .then(character =>{  
        socket.emit("ShowCharacters", character);
        
    })  

    socket.on("clientData", (data) => { 
        
    })

    socket.on("createRoom", (id) => {
        console.log("id: "+ socket.id + "username: " + socket.clientUsername)
    })
   
    socket.on("getAllRooms", () =>{
        let roomLength = 0 
        Object.keys(io.sockets.adapter.rooms).forEach(room =>{
            roomLength++
            console.log(room)
        })  
        socket.emit('getAllGames', io.sockets.adapter.rooms) 
        
             
    })
   

    socket.on("joinGame", () =>{
        console.log(Object.keys(io.sockets.adapter.rooms)[0])
    })

    socket.on("leaveRoomQuick", (id) => {
        socket.leave(id)
    })

    socket.on('disconnect', function(){
        console.log('User disconnect ' + socket.id)       
        socket.leave(socket.id)
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
    let next_turn_damage_reduction = false;
    

    
    //First person to connect is player1
    if(players.length === 1){
        io.emit('isPlayerA');
    }
    
    //once both players are connected
    if(players.length === 2){
        
        io.emit('playersConnected')        
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

    socket.on("removeEnergy", function(energy){
        if(next_turn_damage_reduction){
            socket.broadcast.emit("removeEnergyNow", energy, true) 
        }else{
            socket.broadcast.emit("removeEnergyNow", energy, false) 
        }
    })
    
    socket.on("returnEnergyAmount", function(amount){
        socket.broadcast.emit("removeEnergyAmount", amount)         
    })

    function calculateDamage(effect, characterToUseOn){
        
        let damage = 0;
        let immune = false;
        
        console.log(JSON.stringify("Used " + effect.name+ " on "+ characterToUseOn.charNumber))
        
        
        
        // WE WANT TO CHECK FOR THE CURRENT EFFECTS THEY HAVE 
        Object.keys(characterToUseOn.effect).forEach(key =>{
            if(characterToUseOn.effect[key].name !== undefined){
                if(characterToUseOn.effect[key].effect.damage_reduction !== 0){
                    //IF THEY HAVE A DAMAGE REDUCTION BUFF
                    console.log("Character has a damage reduction")
                    if(characterToUseOn.effect[key].effect.damage_reduction === 100){
                        damage = 0;
                        immune = true;
                    }else{
                        damage -= characterToUseOn.effect[key].effect.damage_reduction;
                    }
                }
                
            }           

        })

        
        if(effect.effect.removeEnergy === true){            
            let energyType = effect.effect.removeEnergyType;
            if(effect.effect.next_turn_damage_reduction === true){   
                next_turn_damage_reduction = true;                 
                io.emit("removeEnergy", (energyType))
            }else{    
                next_turn_damage_reduction = false;           
                io.emit("removeEnergy", (energyType))
            }
        }

        if(effect.effect.damage_more_than_once === false){
            console.log(effect.effect.damageDoneTo)
            io.emit("updateDamageDoneTo", effect, characterToUseOn.charNumber)
            effect.effect.damageDoneTo += characterToUseOn.charNumber;
        }
        //This is where we should calculate the damage and shit
        // We should probably add a check for damage reduction but i cba atm

        return {
            damage: damage,
            charToUseOn: characterToUseOn.charNumber,            
        }
    }

    function setClientData(data){
        socket.clientData = data
    }

    socket.on("test", function(id){
        console.log("HELLO " + id)
        socket.emit("test3", id);
    })

    


})


http.listen(1000, function () {
    console.log('iosocket started')
})




router.get("/", authUser,function(req, res)  {
    if(req.isAuthenticated()){
        user = req.user 
        sendUserData()
        res.render('client/index.ejs',{       
            isLoggedIn: true,
            user: user
        })        
        
        }    
})


function sendUserData() {
    console.log("ss")
    var socket = io
    setTimeout(function () {
        socket.emit("test111", user.name)
    }, 3000);
}






module.exports = router;