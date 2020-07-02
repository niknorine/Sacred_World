class Character extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, name, charNumber){
        var x = 0;
        var y = 0;        
        super(scene, x, y, name, charNumber)
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);

        this.stats = {
            name: name,
            health: 100,
            energy: 5,
            skillUsed: false,
            charNumber: charNumber,
            effect: [
                {effect1: undefined},
                {effect2: undefined},
                {effect3: undefined},
                {effect4: undefined},
            ]
        }

        this.skill = {
            name: "Mirage Step",
            image: "mirage_step",            
        }

 
    }

    
}