var Client = {};

Client.data = {}

Client.socket = io('http://localhost:1000');

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.socket.on("getId", function(socketId){
    Client.data.id = socketId; 
    console.log(Client.data)
})

Client.socket.on('test111',function(data){
    Client.data.name = data;    
    console.log(Client.data)
});

Client.sendTest = function(user){
    console.log("test sent");
    Client.socket.emit('test', user);
  };

Client.socket.on("test3", function(id){    
    console.log("Your username is: " + id)
})
