import Card from '/js/src/helpers/card.js'


export default class Dealer{
    constructor(scene) {
        

        this.readyUp = () =>{
            let playerSprites;
            let opponentSprites;
            let playerCards = []
            if(scene.isPlayerA){
                playerSprites = ['ren', 'girl', 'zul']
                opponentSprites = ['shiro', 'elf', 'ren']
            }else{
                playerSprites = ['shiro', 'elf', 'ren']
                opponentSprites = ['ren', 'girl', 'zul']
            };
            for(let i = 0; i < 3; i++){
                let playerCard = new Card(scene);
                let health = new Card(scene);
                playerCards.push(playerCard.render(120, 600 - (i*250), playerSprites[i],0.065,0.065).setInteractive());

                console.log(playerCards)
                playerCards.forEach(card =>{
                    card.on('pointerup', function(){
                       
                        scene.socket.emit('turnPlayed', card.texture.key);                        
                    })
                })
                
                health.render(120, 690 - (i*250), 'health', 0.2,0.2)

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(1000, 600 - (i*250), opponentSprites[i],0.065,0.065).disableInteractive());
                health.render(1000, 690 - (i*250), 'health', 0.2,0.2)
            }
        }
    }

}