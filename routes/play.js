const express = require('express');
const router = express.Router();
const app = express();
const http = require('http')
const httpServer = http.createServer()
httpServer.listen(4000, () =>console.log('gameClient Listening'))

const websocketServer = require('websocket').server
const{ authUser, authRole } = require('../config/auth')

var socketIO = require('socket.io');
var server = app.listen(2000);
var io = socketIO(server);

var user;




//hashmaps
const clients = {};
const games = {};
const gameIds= {};


const wsServer = new websocketServer({
    'httpServer': httpServer
})


const { client } = require('websocket');
const { response } = require('express');
const { find } = require('../models/User');


router.get("/", authUser,(req, res) => {
    if(req.isAuthenticated()){
        user = req.user
        res.render('main.ejs',{        
            isLoggedIn: true,
            user: user
        })
        }    
})




//Random number generator for game ID
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();


module.exports = router; 

