class Skill extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y, picture, name, character){
   
        super(scene, x, y, picture, name, character)
        
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);


        this.info = {
            name: name,
            
        }    

        this.skill = {
            name: name,
            character: character,
            image: "mirage_step",
            currentCoolDown: 0,
            coolDownDuration: 2,
            

            cost: {
                physical: 0,
                magic: 0,
                strategy: 0,
                agility: 0,
                unique: 0,
                support: 1
            },

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