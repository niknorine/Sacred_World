import Card from '/js/src/helpers/card.js';
import Dealer from '/js/src/helpers/dealer.js';

export default class Game extends Phaser.Scene{
    constructor(){
        super({
            key: "Game"
        })
        
    }

    preload(){
        this.load.image('shiro', '/js/src/assets/shiro.png')
        this.load.image('ren', '/js/src/assets/ren.png')
        this.load.image('zul', '/js/src/assets/zul.jpg')
        this.load.image('elf', '/js/src/assets/elf.png')
        this.load.image('girl', '/js/src/assets/girl.jpg')
        this.load.image('health', '/js/src/assets/health.png')


        this.socket = io('http://localhost:1000')
        let test = this.socket;
    }

    create(){
        let self = this;
        let addedClicks = false;

        this.isPlayerA = false;
        this.opponentCards = [];
        this.playerCards = [];

        
        this.dealer = new Dealer(this);


        

        this.socket.on('connect', function () {
            console.log('CONNECTED')
        })

        this.socket.on('isPlayerA', function(){
            self.isPlayerA = true;
        })
        
        this.readyUpText = this.add.text(75, 350, ["READY UP"]).setFont(18).setFontFamily('Trebuchet MS').setColor("#00ffff").setInteractive();
        
   
        this.socket.on('readyUp', function (){
            self.dealer.readyUp();
            self.readyUpText.disableInteractive();
        })


        this.readyUpText.on('pointerdown', function(){
            self.socket.emit('readyUp');
        })

        this.readyUpText.on('pointerover', function () {
            self.readyUpText.setColor('#ff69b4')
        })

        this.readyUpText.on('pointerout', function (){
            self.readyUpText.setColor('#00ffff')
        })
        
        this.socket.on('turnPlayed', function (gameObject){
            
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                let card = new Card(self);                
            
        })

        
        
    }

    

    update(){        

    }


}


