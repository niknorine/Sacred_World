import {CST} from "/js/src/scenes/CST.js"
import {Client} from "/js/src/client.js"
import {GameScene} from "/js/src/scenes/GameScene.js"

/*
SOME IMPORTANT SYNTAX

this.game.renderer.width - width of the game
this.game.renderer.height - heigh of the game



*/


export class MenuScene extends Phaser.Scene{
    
    

    constructor(){
        super({
            key: CST.SCENES.MENU
        })           
    }


    
    init(data){
        
    }
    preload(){

    }

    create(){

        Client.clientConnected();
        


        var scene = this;
        let id = "";

        // this.socket = io('http://localhost:1000')
        
        //ADD ASSETS INTO THE GAME
        let logo = this.add.image(100, 100,"logo").setScale(0.05,0.05).setOrigin(0).setDepth(1);
        logo.setVisible(false);
        this.background = this.add.image(0,0,"background").setOrigin(0).setDepth(0);
        
        let playButton = this.add.image(this.game.renderer.width / 2.8, this.game.renderer.width /6,"start").setScale(0.6,0.6).setOrigin(0).setDepth(0).setVisible(false);
        let start = this.add.text(this.game.renderer.width / 2.8, this.game.renderer.width /6, "Start Matchmaking", { font: '"Press Start 2P"' }).setDepth(200).setVisible(true).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4).setInteractive()
        this.info = this.add.text(this.game.renderer.width / 2.8, this.game.renderer.width /2.8, "Info: ", { font: '"Press Start 2P"' }).setDepth(200).setVisible(true).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4).setInteractive()

           

        // this.socket.on("socketId", function(data){
        //     id = data;
        //     console.log(id)
        //     scene.socket.emit("joinMainRoom")            
        // })
         
        // this.socket.on("sendData", (clientInfo) =>{
        //     console.log("ss" + clientInfo)
        // })
       
        
        // this.socket.on("test", user =>{         
        //     console.log(user)  
        //     this.socket.emit("clientData", user)
        // })
        

        //POINTER EVENTS
        playButton.setInteractive();

        playButton.on("pointerover", () => {            
            console.log("hover")
            logo.setVisible(true);
            logo.x = playButton.x - playButton.width / 4;
            logo.y = playButton.y
        })
        playButton.on("pointerout", () => {
            console.log("unhover")
            logo.setVisible(false);

        })

        start.on("pointerup", () => {                               
            //this.socket.emit("createRoom", id) 
            this.Test1()           
        })
        if(!Client.socket.connected){
            this.info.setText("You are not connected to the game server")
        }else{
            
        }
        Client.checkConnection()

    }

    update(){        
        if(this.info.active){
            this.Test1()
        }
         
    }

    Test1(){
        this.info.setText("222")
    }

    PlayerConnected(){
        this.info.setText("you are already signed in somewhere else")
    }



}



