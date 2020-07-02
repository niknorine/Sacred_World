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
        this.load.image('kyros', '/js/src/assets/kyros.png')
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
        this.load.image('devil', '/js/src/assets/devil.png')

        //effect placeholder
        this.load.image('effect', '/js/src/assets/white.png')


        this.load.image('skill4', '/js/src/assets/Ren_Skill_1_x_100.png')
        this.load.image('skill5', '/js/src/assets/Ren_Skill_2_x_100.png')
        this.load.image('skill6', '/js/src/assets/Ren_Skill_3_x_100.png')
        this.load.image('skill7', '/js/src/assets/Ren_Skill_4_x_100.png')

        this.load.image('serrated_wind_slash', '/js/src/assets/Kyros_Skill_1_x_100.png')
        this.load.image('silent_dagger', '/js/src/assets/Kyros_Skill_2_x_100.png')
        this.load.image('trojan_execution', '/js/src/assets/Kyros_Skill_3_x_100.png')
        this.load.image('evasive_charge', '/js/src/assets/Kyros_Skill_4_x_100.png')
        
        this.load.json("test", '/js/src/helpers/test.json')
        this.load.json("test2", '/js/src/helpers/test2.json')
        this.load.json("test3", '/js/src/helpers/test3.json')
        this.load.json("test4", '/js/src/helpers/test4.json')
        this.load.json("test5", '/js/src/helpers/test5.json')
        this.load.json("test6", '/js/src/helpers/test6.json')
        this.load.json("test7", '/js/src/helpers/test7.json')
        this.load.json("test8", '/js/src/helpers/test8.json')
        this.load.json("test9", '/js/src/helpers/test9.json')
        this.load.json("test10", '/js/src/helpers/test10.json')
        this.load.json("test11", '/js/src/helpers/test11.json')
        this.load.json("test12", '/js/src/helpers/test12.json')


        

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