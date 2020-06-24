class Character extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, name){
        var x = 0;
        var y = 0;        
        super(scene, x, y, name)
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);

        this.stats = {
            health: 100,
            energy: 5,
        }

        this.skill = {
            name: "Mirage Step",
            image: "mirage_step",            
        }
    }

    
}