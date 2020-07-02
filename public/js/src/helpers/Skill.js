class Skill extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y, picture, name, character, skill){
   
        super(scene, x, y, picture, name, character, skill)
        
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);


        this.info = {
            name: name,
            
        }    

        this.skill = {
            skill
        }

    }
}