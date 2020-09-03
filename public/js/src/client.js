import {MenuScene} from "/js/src/scenes/MenuScene.js"

export var Client = {}; // Do not touch

Client.data = {} // Do not touch

Client.socket = io('http://localhost:1000'); // Do not touch


// WE WILL ADD ALL THE SENDING/EMITING FUNCTIONS HERE 
//this is where the user sends a request to the server

Client.clientConnected = function(){
    Client.socket.emit('clientConnected', Client.data.id);

    
};

Client.sendUser = function(user){    
    Client.socket.emit('sendUsername', user);
};

Client.checkConnection = function(){
    Client.socket.emit("checkConnection")
}

Client.finishedLoading = function(){
    let menu = new MenuScene;
    menu.Test1()
}







//////////////////////////////////////



// WE WILL ADD ALL THE RECEIVING FUNCTIONS HERE
//this is where the user receives a request from the server

Client.socket.on("getId", function(socketId){
    Client.data.id = socketId; 
    console.log(Client.data)
})

Client.socket.on("sendUsernameToClient", function(id){
    Client.data.id = id;
    Client.socket.emit('changeRoom', 'main')
})

Client.socket.on("alreadyConnected", function(){
    
})



