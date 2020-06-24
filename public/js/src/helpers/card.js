

export default class Card{
    constructor(scene){
        this.render = (x, y, sprite, scale1, scale2) => {
            //let card = scene.add.image(x, y, sprite).setScale(scale1,scale2).setInteractive();            
            let card = new Character({scene:this, x:100,y:100})
            return card;
        }
    }


}