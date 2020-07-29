var Client = {};

Client.socket = io('http://localhost:1000');

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};