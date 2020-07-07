class Effect extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y, picture, name, skill){
   
        super(scene, x, y, picture, name, skill)
        
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);


        this.info = {
            name: name,
            
            
        }    

        this.skill =         {
            name: name,
            used: false,          
            image: "mirage_step",
            currentCoolDown: 0,
            coolDownDuration: 2,
            duration: 1,

            effect:{
                damage: 0,
                damage_reduction: 100,
                next_skill_reduction: "physical",
                next_skill_reduction_ammount: 1,
                lingering_damage: 0
            }
        }

    }
}