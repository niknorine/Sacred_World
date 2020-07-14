class Buff extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y, picture, name, skill, amount){
   
        super(scene, x, y, picture, name, skill, amount)
        
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);


        this.info = {
            name: name,
        }    

        this.skill =         {
            name: name,
            used: false,          
            image: picture,
            duration: 1,
            effect:{
                damage_reduction: amount,
            }
        }

    }
}