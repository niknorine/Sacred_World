import {CST} from "/js/src/scenes/CST.js"

export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        })
    }
    init(){
       
    }
    preload(){
        //LOAD ASSETS
        this.load.image('shiro', '/js/src/assets/shiro.png')
        this.load.image('ren', '/js/src/assets/ren.png')
        this.load.image('zul', '/js/src/assets/zul.jpg')
        this.load.image('elf', '/js/src/assets/elf.png')
        this.load.image('girl', '/js/src/assets/girl.jpg')
        this.load.image('health', '/js/src/assets/health.png')
        this.load.image('background', '/js/src/assets/background.jpg')
        this.load.image('logo', '/js/src/assets/logo.png')
        this.load.image('start', '/js/src/assets/start.png')

        //skills
        this.load.image('mirage_step', '/js/src/assets/mirage_step.png')
        this.load.image('skill1', '/js/src/assets/skill2.png')
        this.load.image('skill2', '/js/src/assets/skill3.png')
        


        

        //for audio
        //this.load.audio("name", "path")

        //CREATE LOADING BAR
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })

        //CREATE PROGRESS BAR
        this.load.on('progress', (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height /2, this.game.renderer.width * percent, 50)
            console.log(percent)
        })

        this.load.on('complete', () => {
           
            this.scene.start(CST.SCENES.MENU, "Hello")
        })
    }

    create(){
       
    }

}