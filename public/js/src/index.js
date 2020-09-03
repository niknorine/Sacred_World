
/** @type {import("../typings/phaser")} */
import {LoadScene} from "/js/src/scenes/LoadScene.js"
import {MenuScene} from "/js/src/scenes/MenuScene.js"
import {GameScene} from "/js/src/scenes/GameScene.js"


let game = new Phaser.Game({
    width: 1280,
    height: 720,
    parent: 'phaser-example',
    type: Phaser.AUTO,
    scene:[
        LoadScene,MenuScene,GameScene
    ]

})






