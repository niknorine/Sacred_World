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
        //ADD ASSETS INTO THE GAME
        let logo = this.add.image(100, 100,"logo").setScale(0.05,0.05).setOrigin(0).setDepth(1);
        logo.setVisible(false);

        this.add.image(0,0,"background").setOrigin(0).setDepth(0);
        let playButton = this.add.image(this.game.renderer.width / 2.8, this.game.renderer.width /6,"start").setScale(0.6,0.6).setOrigin(0).setDepth(0);
        
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
        playButton.on("pointerup", () => {                   
            this.scene.start(CST.SCENES.GAME)            
        })


        
    }
}