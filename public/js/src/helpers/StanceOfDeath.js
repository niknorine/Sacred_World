class StanceOfDeath extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y, picture, name){
   
        super(scene, x, y, picture)
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);


        this.info = {
            name: name,
            character: "shiro"
        }    

        this.skill = {
            name: name,
            image: "skill3",
            currentCoolDown: 0,
            coolDownDuration: 2,

            cost: {
                total: 2,
                physical: 0,
                magic: 0,
                strategy: 0,
                agility: 0,
                unique: 0,
                support: 1,
                random: 1
            },

            effect:{
                damage: 0,
                damage_reduction: 10,
                next_skill_reduction: "physical",
                next_skill_reduction_amount: 1,
                lingering_damage: 0,
                harming: 2,
                remove_buffs: 1
            }
        }
    }
}