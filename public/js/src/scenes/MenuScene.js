import {CST} from "/js/src/scenes/CST.js"

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
        var scene = this;
        let id = "";

        this.socket = io('http://localhost:1000')
        
        //ADD ASSETS INTO THE GAME
        let logo = this.add.image(100, 100,"logo").setScale(0.05,0.05).setOrigin(0).setDepth(1);
        logo.setVisible(false);

        this.add.image(0,0,"background").setOrigin(0).setDepth(0);
        let playButton = this.add.image(this.game.renderer.width / 2.8, this.game.renderer.width /6,"start").setScale(0.6,0.6).setOrigin(0).setDepth(0).setVisible(false);
        let create = this.add.text(this.game.renderer.width / 2.8, this.game.renderer.width /6, "Create Game", { font: '"Press Start 2P"' }).setDepth(200).setVisible(true).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4).setInteractive()
        let join = this.add.text(this.game.renderer.width / 2.8, this.game.renderer.width /4.8, "Join Game", { font: '"Press Start 2P"' }).setDepth(200).setVisible(true).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4).setInteractive()
        let info = this.add.text(this.game.renderer.width / 2.8, this.game.renderer.width /2.8, "Info: ", { font: '"Press Start 2P"' }).setDepth(200).setVisible(true).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4).setInteractive()

        this.socket.on("socketId", function(data){
            id = data;
            console.log(id)
            scene.socket.emit("joinMainRoom")            
        })
         

        
        
        

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

        create.on("pointerup", () => {                               
            this.socket.emit("createRoom", id)
            this.scene.start(CST.SCENES.GAME, id)
        })

        join.on("pointerup", () => {
            this.socket.emit('getAllRooms')          
        })

        this.socket.on('getAllGames', function(data){
            if(data === undefined){
                info.setText("Info: Currently No Games, Please Create One")
            }
            scene.socket.emit("joinGame")
        })


        
    }
}