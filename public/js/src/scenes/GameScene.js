import {CST} from "/js/src/scenes/CST.js"

//CLIENT SIDE 

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.GAME
        })
    }


    init(data){
        this.socket = io('http://localhost:1000') // DONT TOUCH THIS. THIS IS THE CONNECTION TO THE SERVER
        console.log(this.socket.id)
        console.log(data)
        this.socketId = data.socketId;
    }

    preload() {
        

    }

    create() {
        
        var scene = this;
        
        let savedSkillText = "";
        let savedCostText = "";

        let myTurn = false;

        
        var rect = new Phaser.Geom.Rectangle(680, 595, 600, 125)

        var graphics = this.add.graphics({ fillStyle: { color: 0xFFFFFF, alpha: 0.3}});

        let effectDescTxt = this.add.text(680, 595, "Description: ", { font: '"Press Start 2P"' }).setDepth(200).setVisible(true).setColor("#000000").setFontSize("20px").setWordWrapWidth(500)
        let effectCostTxt = this.add.text(680, 700, "Cost: ", { font: '"Press Start 2P"' }).setDepth(200).setVisible(true).setColor("#000000").setFontSize("20px").setWordWrapWidth(500)

        graphics.fillRectShape(rect).setDepth(200).lineStyle(2, 0x1F1F1F , 1);
        
        
      
        // We will keep the selected skill. We want to know what skill the character has selected.
        let selectedSkill = {};

    


        //ARRAYS AND OTHER SHIT
        var gameInitiated = false; 
        let isPlayerA = false;
        let OpponentCharacter = [];
        let characters = [];
        let charactersHeath = [];
        let opponentsHealth = [];

        let character1Skills = [];
        let character2Skills = [];
        let character3Skills = [];
        let character4Skills = [];
        let character5Skills = [];
        let character6Skills = [];
        let allSkills = []

        let char1effects = []
        let char2effects = []
        let char3effects = []
        let char4effects = []
        let char5effects = []
        let char6effects = []


        let updatedDuration = true
       
        let testSkill = this.cache.json.get("test")


        
        let enemyUsedSkillsLastRound = [];
        let usedSkillsThisRound = [];

        let char1_skills_used = false;
        let char2_skills_used = false;
        let char3_skills_used = false;
        let randomSelect = undefined;

        let char1_cooldowns = [];
        let char2_cooldowns = [];
        let char3_cooldowns = [];
        let char4_cooldowns = [];
        let char5_cooldowns = [];
        let char6_cooldowns = [];
        //background. dont know why i named it test
        let test =  this.add.image(0,0,"background").setOrigin(0).setDepth(0).setInteractive().setDepth(1);
       
        // Energy System. We can probably move this to the server side.
        let Energy = {
                physical: 0,
                magic: 0,
                strategy: 0,
                agility: 0,
                unique: 0,
                support: 0
        }

        let endTurnText = this.add.text(100 ,550, "End Turn", { font: '"Press Start 2P"' }).setDepth(200).setVisible(false).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4).setInteractive()

        // Declaring the characters. isPlayerA will be (char1, char2, char3) and the other player will be (char4, char5, char6)
        // We should probably move this to the server side, as in, we pass the data of the character from the server

        // I hard coded it for now for easier testing
        var char1 = new Character(this, 0,0, "shiro", 1).setScale(1, 1).setDepth(100).setVisible(false) 
        var char2 = new Character(this, 0,0, "ren", 2).setScale(1, 1).setDepth(100).setVisible(false)       
        var char3 = new Character(this, 0,0, "kyros", 3).setScale(1, 1).setDepth(100).setVisible(false)   
        // Characters for the player that is not isPlayerA
        var char4 = new Character(this, 0,0, "ren", 4).setScale(1, 1).setDepth(100).setVisible(false)         
        var char5 = new Character(this, 0,0, "kyros", 5).setScale(1, 1).setDepth(100).setVisible(false)       
        var char6 = new Character(this, 0,0, "shiro", 6).setScale(1, 1).setDepth(100).setVisible(false) 

        var char1Effect1 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char1Effect2 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char1Effect3 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)

        var char2Effect1 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char2Effect2 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char2Effect3 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)

        var char3Effect1 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char3Effect2 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char3Effect3 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)

        var char4Effect1 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char4Effect2 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char4Effect3 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)

        var char5Effect1 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char5Effect2 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char5Effect3 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)

        var char6Effect1 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char6Effect2 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)
        var char6Effect3 = new Effect(this,0,0, "effect", "Mirage Step").setDepth(102).setScale(0.3,0.3)

        

        //Health. The value of this is set further down
        var char1_health = this.add.text(0, 0, '', { font: '"Press Start 2P"'}).setDepth(101).setVisible(false) 
        var char2_health = this.add.text(0, 0, '', { font: '"Press Start 2P"'}).setDepth(101).setVisible(false) ;
        var char3_health = this.add.text(0, 0, '', { font: '"Press Start 2P"'}).setDepth(101).setVisible(false)
        

        var char4_health = this.add.text(0, 0, '', { font: '"Press Start 2P"'}).setDepth(101).setVisible(false) 
        var char5_health = this.add.text(0, 0, '', { font: '"Press Start 2P"'}).setDepth(101).setVisible(false) ;
        var char6_health = this.add.text(0, 0, '', { font: '"Press Start 2P"'}).setDepth(101).setVisible(false) ;//We put the health in an array for positioning reasons easier to for loop to position them.
        
        


        //health for player 2

        
        //These are the skills for the first character. tbh i dont know the best way to declare them. Maybe we can have JSON for each character with their skills
        // and then declare them like (let char1_skill1 = new Skill(this,0,0, char1.skill.json))
        
        let char1_skill1 = new Skill(this,0,0, "mirage_step", "Mirage Step", char1.stats.name, this.cache.json.get("test")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char1_skill2 = new Skill(this,0,0, "heaven_eater", "Heaven Eater", char1.stats.name, this.cache.json.get("test2")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char1_skill3 = new Skill(this,0,0, "devil_piercer", "Stance Of Death", char1.stats.name, this.cache.json.get("test3")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char1_skill4 = new Skill(this,0,0, "stance_of_death", "Devil Piercer", char1.stats.name, this.cache.json.get("test4")).setDepth(102).setScale(0.5,0.5).setInteractive();
        
        let char1_skill1_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char1_skill2_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char1_skill3_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char1_skill4_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        char1_cooldowns.push(char1_skill1_cooldown, char1_skill2_cooldown, char1_skill3_cooldown, char1_skill4_cooldown)


        let char2_skill1 = new Skill(this,0,0, "fist_of_the_rising_sun", "Fist of the Rising Sun", char2.stats.name, this.cache.json.get("test9")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char2_skill2 = new Skill(this,0,0, "tsunami_vice_takedown", "Tsunami Vice Takedown", char2.stats.name, this.cache.json.get("test10")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char2_skill3 = new Skill(this,0,0, "arm_quake", "Arm Quake", char2.stats.name, this.cache.json.get("test11")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char2_skill4 = new Skill(this,0,0, "eye_of_the_tiger", "Eye of the Tiger", char2.stats.name, this.cache.json.get("test12")).setDepth(102).setScale(0.5,0.5).setInteractive();

        let char2_skill1_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char2_skill2_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char2_skill3_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char2_skill4_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        char2_cooldowns.push(char2_skill1_cooldown, char2_skill2_cooldown, char2_skill3_cooldown, char2_skill4_cooldown)       


        let char3_skill1 = new Skill(this,0,0, "serrated_wind_slash", "Wind Slash", char3.stats.name, this.cache.json.get("test5")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char3_skill2 = new Skill(this,0,0, "silent_dagger", "Silent Dagger", char3.stats.name, this.cache.json.get("test6")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char3_skill3 = new Skill(this,0,0, "trojan_execution", "Trojan Execution", char3.stats.name, this.cache.json.get("test7")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char3_skill4 = new Skill(this,0,0, "evasive_charge", "Charge", char3.stats.name, this.cache.json.get("test8")).setDepth(102).setScale(0.5,0.5).setInteractive();

        let char3_skill1_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char3_skill2_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char3_skill3_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char3_skill4_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        char3_cooldowns.push(char3_skill1_cooldown, char3_skill2_cooldown, char3_skill3_cooldown,char3_skill4_cooldown)


        let char4_skill1 = new Skill(this,0,0, "fist_of_the_rising_sun", "Fist of the Rising Sun", char4.stats.name, this.cache.json.get("test9")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char4_skill2 = new Skill(this,0,0, "tsunami_vice_takedown", "Tsunami Vice Takedown", char4.stats.name, this.cache.json.get("test10")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char4_skill3 = new Skill(this,0,0, "arm_quake", "Arm Quake", char4.stats.name, this.cache.json.get("test11")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char4_skill4 = new Skill(this,0,0, "eye_of_the_tiger", "Eye of the Tiger", char4.stats.name, this.cache.json.get("test12")).setDepth(102).setScale(0.5,0.5).setInteractive();
       
        let char4_skill1_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char4_skill2_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char4_skill3_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char4_skill4_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;        
        char4_cooldowns.push(char4_skill1_cooldown, char4_skill2_cooldown, char4_skill3_cooldown,char4_skill4_cooldown)


        let char5_skill1 = new Skill(this,0,0, "serrated_wind_slash", "Wind Slash", char5.stats.name, this.cache.json.get("test5")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char5_skill2 = new Skill(this,0,0, "silent_dagger", "Silent Dagger", char5.stats.name, this.cache.json.get("test6")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char5_skill3 = new Skill(this,0,0, "trojan_execution", "Trojan Execution", char5.stats.name, this.cache.json.get("test7")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char5_skill4 = new Skill(this,0,0, "evasive_charge", "Charge", char5.stats.name, this.cache.json.get("test8")).setDepth(102).setScale(0.5,0.5).setInteractive();

        let char5_skill1_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char5_skill2_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char5_skill3_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char5_skill4_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        char5_cooldowns.push(char5_skill1_cooldown, char5_skill2_cooldown, char5_skill3_cooldown,char5_skill4_cooldown)

        let char6_skill1 = new Skill(this,0,0, "mirage_step", "Mirage Step", char6.stats.name, this.cache.json.get("test")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char6_skill2 = new Skill(this,0,0, "heaven_eater", "Heaven Eater", char6.stats.name, this.cache.json.get("test2")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char6_skill3 = new Skill(this,0,0, "devil_piercer", "Stance Of Death", char6.stats.name, this.cache.json.get("test3")).setDepth(102).setScale(0.5,0.5).setInteractive();
        let char6_skill4 = new Skill(this,0,0, "stance_of_death", "Devil Piercer", char6.stats.name, this.cache.json.get("test4")).setDepth(102).setScale(0.5,0.5).setInteractive();

        let char6_skill1_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char6_skill2_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char6_skill3_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char6_skill4_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;        
        char6_cooldowns.push(char6_skill1_cooldown, char6_skill2_cooldown, char6_skill3_cooldown,char6_skill4_cooldown)
        
        //The energy text. We will change this from text to some ui. This is for testing purposes.
        var testtext = this.add.text(10, 100, this.socketId, { font: '"Press Start 2P"' }).setDepth(101).setVisible(true) ;
        var physical = this.add.text(10, 540, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Physical: " + Energy.physical).setInteractive();
        var magic = this.add.text(160, 540, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Magic: " + Energy.magic).setInteractive();
        var strategy = this.add.text(310, 540, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Strategy: " + Energy.strategy).setInteractive();
        var agility = this.add.text(460, 540, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Agility: " + Energy.agility).setInteractive();
        var unique  = this.add.text(610, 540, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Unique: " + Energy.unique).setInteractive();
        var support = this.add.text(760, 540, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Support: " + Energy.support).setInteractive();
        // self.char1_skill3.on('pointerup', () => {
        
        //     this.socket.emit("useSkill", char1_skill3)
        // })

        var characterText = this.add.text(100, 10, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true) ;

        this.socket.on("findRooms", (data) => {
            //console.log(data)
        })

        // WHEN BOTH PLAYERS HAVE CONNECTED!!!
        this.socket.on("playersConnected", function () {
            // We want to check who is player1 and who is player2 that way we can correctly display everything.
            // For example we don't want player1 to be able to see and use player2 skills


            // We use the gameInitiated variable so that we only do this once.
            if(gameInitiated === false){
                if(this.isPlayerA){
                    console.log("huge penis")
                    myTurn = true;
                    endTurnText.setVisible(true);
                    // Because we made char1,char2,char3 playerA characters, we push them into a characters array.
                    characters.push(char1, char2, char3);
                    console.log(char1_skill1)                    
                    OpponentCharacter.push(char4,char5,char6)
                    charactersHeath.push(char1_health, char2_health, char3_health) 
                    opponentsHealth.push(char4_health, char5_health, char6_health)
                    //we push the skills into an array too. We will need more arrays, atm its hard coded
                    character1Skills.push(char1_skill1, char1_skill2, char1_skill3, char1_skill4);
                    character2Skills.push(char2_skill1, char2_skill2, char2_skill3, char2_skill4);
                    character3Skills.push(char3_skill1, char3_skill2, char3_skill3, char3_skill4);
                    allSkills.push(char1_skill1, char1_skill2, char1_skill3, char1_skill4 ,char2_skill1, char2_skill2, char2_skill3, char2_skill4, char3_skill1, char3_skill2, char3_skill3, char3_skill4)
                    // We declare the opponents characters
                    char1effects.push(char1Effect1, char1Effect2, char1Effect3)
                    char2effects.push(char2Effect1, char2Effect2, char2Effect3)
                    char3effects.push(char3Effect1, char3Effect2, char3Effect3)

                    char4effects.push(char4Effect1, char4Effect2, char4Effect3)
                    char5effects.push(char5Effect1, char5Effect2, char5Effect3)
                    char6effects.push(char6Effect1, char6Effect2, char6Effect3)
                    for(let i = 0; i < characters.length; i++){
                        characters[i].disableInteractive()
 

                        char1effects[i].setOrigin((i + 2) * -1.5 ,-3.5)
                        char2effects[i].setOrigin((i + 2) * -1.5 ,-10.5)
                        char3effects[i].setOrigin((i + 2) * -1.5 ,-17.0)

                        char4effects[i].setOrigin((i + 22) * -1.5 ,-4)
                        char5effects[i].setOrigin((i + 22) * -1.5 ,-11)
                        char6effects[i].setOrigin((i + 22) * -1.5 ,-18)
                    }
                    //cool down text
                    for(let i = 0; i < char1_cooldowns.length; i++){
                        char1_cooldowns[i].setVisible(true).setOrigin((i + 2) * -1.7 ,-2.6).setText("CD: " + character1Skills[i].skill.skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                        char2_cooldowns[i].setVisible(true).setOrigin((i + 2) * -1.7 ,-12.0).setText("CD: " + character2Skills[i].skill.skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                        char3_cooldowns[i].setVisible(true).setOrigin((i + 2) * -1.7 ,-20.4).setText("CD: " + character3Skills[i].skill.skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                    }
                    //skils
                    for(let i = 0; i < character2Skills.length; i++){
                        character1Skills[i].setOrigin((i + 2) * -2.2 ,-0.6)   
                        character2Skills[i].setOrigin((i + 2) * -2.2 ,-4.9)
                        character3Skills[i].setOrigin((i + 2) * -2.2 ,-8.9)
                    }
                }else{
                    //This means you are player2. We flip the characters around.
                    character4Skills.push(char4_skill1,char4_skill2,char4_skill3,char4_skill4)
                    character5Skills.push(char5_skill1,char5_skill2,char5_skill3,char5_skill4)
                    character6Skills.push(char6_skill1,char6_skill2,char6_skill3,char6_skill4)
                    OpponentCharacter.push(char1, char2, char3);
                    characters.push(char4,char5,char6)
                    opponentsHealth.push(char1_health, char2_health, char3_health) 
                    charactersHeath.push(char4_health, char5_health, char6_health)
                    char1effects.push(char1Effect3,char1Effect2, char1Effect1)
                    char2effects.push(char2Effect1, char2Effect2, char2Effect3)
                    char3effects.push(char3Effect1, char3Effect2, char3Effect3)
                    char4effects.push(char4Effect1, char4Effect2, char4Effect3)
                    char5effects.push(char5Effect1, char5Effect2, char5Effect3)
                    char6effects.push(char6Effect1, char6Effect2, char6Effect3)
                    for(let i = 0; i < characters.length; i++){
                        characters[i].disableInteractive()


                        char1effects[i].setOrigin((i + 15) * -2.2 ,-4)
                        char2effects[i].setOrigin((i + 15) * -2.2 ,-10)
                        char3effects[i].setOrigin((i + 15) * -2.2 ,-17)

                        char4effects[i].setOrigin((i + 2) * -1.5 ,-3.5)
                        char5effects[i].setOrigin((i + 2) * -1.5 ,-10.5)
                        char6effects[i].setOrigin((i + 2) * -1.5 ,-17)
                    }
                    
                    allSkills.push(char4_skill1,char4_skill2,char4_skill3,char4_skill4)
                    for(let i = 0; i < character4Skills.length; i++){
                        character4Skills[i].setInteractive()
                        character5Skills[i].setInteractive()
                        character6Skills[i].setInteractive()
                    }
                    for(let i = 0; i < character4Skills.length; i++){
                        character4Skills[i].setOrigin((i + 2) * -2.2 ,-0.6) 
                        character5Skills[i].setOrigin((i + 2) * -2.2 ,-4.9)  
                        character6Skills[i].setOrigin((i + 2) * -2.2 ,-8.9)                               
                    }
                    for(let i = 0; i < char4_cooldowns.length; i++){
                        char4_cooldowns[i].setVisible(true).setOrigin((i + 2) * -1.7 ,-2.6).setText("CD: " + character4Skills[i].skill.skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                        char5_cooldowns[i].setVisible(true).setOrigin((i + 2) * -1.7 ,-2.6).setText("CD: " + character5Skills[i].skill.skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                        char6_cooldowns[i].setVisible(true).setOrigin((i + 2) * -1.7 ,-2.6).setText("CD: " + character6Skills[i].skill.skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                    }
                }
                
                //This is to position and modify the different arrays we created

                for(let i = 0; i < characters.length; i++){
                    
                    characters[i].setOrigin(-1, -2 * [i]).setVisible(true)
                    OpponentCharacter[i].setOrigin(-10, -2 * [i]) .setInteractive().setVisible(true).setFlipX(true)
                    charactersHeath[i].setVisible(true).setOrigin(-1.6, -9 * [i]).setText("Health: " + characters[i].stats.health).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4).setFixedSize(142, i + 20)
                    opponentsHealth[i].setVisible(true).setOrigin(-6.0, -9 * [i]).setText("Health: " + characters[i].stats.health).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4).setFixedSize(142, i + 20)
                    //char3_cooldowns[i].setVisible(true).setOrigin((i + 2) * -1.7 ,-20).setText("CD: " + character3Skills[i].skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                    
                }

                // for(let i = 0; i < character3Skills.length; i++){
                                     
                //     //character3Skills[i].setOrigin((i + 2) * -1.7 ,-7.2)
                // }         

               
                
                //Don't know why im writing this here, but we probably want to create a JSON object server side for each player. We can import data from the database and shit aswell.
                
                //random energy. We should move this to server side. We also need to change this so that it actually does it correctly
                //atm it's here for testing purposes
                randomizeAndUpdateEnergy();

                // We have finished initiating the game. we make the variable true so we don't run that code again
                gameInitiated = true;                
            }



        })

        /* SYNTAX THAT WILL SAVE YOU TIME FROM SEARCHING GOOGLE 

        
        this.socket.on("name of action", function(pass data if needed){
            (this runs when the action gets sent from the server. The server side also has a section like this explaining)
            //WHAT EVER YOU WANT TO DO
        })

        objectname.on("pointerup", () => { 
            (this is when you click on something. YOU MUST MAKE THE OBJECT .setInteractive() OR IT WONT WORK)                
            //do what ever
        })

        this.socket.emit('action'); This is to send a request to the server. 
        
        
        
        */
        let charactersTest = [];

        this.socket.on('ShowCharacters', function(dataFromDataBase){
            var i = 0
            Object.keys(dataFromDataBase).forEach(char => {
                i++
                charactersTest[i] = dataFromDataBase[char].char_name
                
            })
            for(var i = 1; i < charactersTest.length; i++){
                console.log(charactersTest[i])
                this["char"+i] = scene.add.text(100 * (i * i), "Character " + i + ": " + charactersTest[i] + " .", { font: '"Press Start 2P"' }).setDepth(101).setVisible(true) ;;
                //characterText.text += "Character " + i + ": " + charactersTest[i] + " ."
            }
            
        })

        this.socket.on('isPlayerA', function(){
            //First person to join is isPlayerA. We use this to load the characters correctly.
            this.isPlayerA = true;            
            this.turn = true;
            
        })
        
         //We have a function for this.
        this.socket.on('updateEnergy', function(){                      
            physical.setText("Physical: " + Energy.physical).setInteractive();
            magic.setText("Magic: " + Energy.magic).setInteractive();
            strategy.setText("Strategy: " + Energy.strategy).setInteractive();
            agility.setText("Agility: " + Energy.agility).setInteractive();
            unique.setText("Unique: " + Energy.unique).setInteractive();
            support.setText("Support: " + Energy.support).setInteractive();
        })

        this.socket.on("nextTurn", function(data, skillsUsed){
            //We should create a function that will be in charge of updating the cool downs of the skills
            //and another to handle the effects on the player and another for energy
            endTurnText.setVisible(false);
            if(data === "player1" && this.isPlayerA){
                endTurnText.setVisible(true);
                myTurn = true;
                updatedDuration = false;
                updateEffectDuration()
                console.log(char4.stats.effect)
                usedSkillsThisRound = []
                enemyUsedSkillsLastRound = []
                UpdateCoolDown()                
                randomizeAndUpdateEnergy()
                updateHealthText()
            }
            if(data === "player2" && this.isPlayerA){
                endTurnText.setVisible(false);
                myTurn = false;    
                scene.socket.emit("getEnemyTurn", usedSkillsThisRound);            
                updateHealthText()                
               
            }
            if(data === "player1" && !this.isPlayerA){
                endTurnText.setVisible(false);
                myTurn = false;  
                scene.socket.emit("getEnemyTurn", usedSkillsThisRound);             
                updateHealthText()                
            }
            if(data === "player2" && !this.isPlayerA){
                endTurnText.setVisible(true);
                myTurn = true; 
                updateEffectVisuals() 
                updateEffectDuration()
                console.log(char4.stats.effect)
                updatedDuration = false;                
                usedSkillsThisRound = []
                enemyUsedSkillsLastRound = []
                UpdateCoolDown() 
                randomizeAndUpdateEnergy()      
                updateHealthText()      
            }
            clearAllVisuals();
        })

        //ONCE THE PLAYER SELECTS A SKILL
        this.socket.on('selectSkill', function(data, skill, character){  
            //console.log(skill.currentCoolDown)      
            if(myTurn && character.skillUsed === false){  
                
               
                //Check if the skill has a cool down
                if(skill.skill.currentCoolDown === 0){
                    
                    //If the skill doesn't have a cool down
                    if(selectedSkill !== undefined && selectedSkill.name == skill.skill.name){
                        console.log(selectedSkill.name + " : " + skill.skill.name)
                        //This is if they have clicked the same skill. We want to deselect it.
                        OpponentCharacter.forEach(char => {                            //We change the enemy characters to normal
                            removeSkillText()
                            clearAllVisuals()
                            char.setInteractive(false)
                            selectedSkill = undefined;
                            
                        }) 
                    }else{
                        //This means we can make the selected skill something else, as its not already selected, or there is no selected skill
                            
                            selectedSkill = skill.skill;
                            onClickSkill(skill)
                            //we want to loop through each skill to remove the visuals
                            clearAllVisuals();
                            
                            updateOnSkillClick(selectedSkill, character, false)                            
                        //as we are selecting a skill to be used, we want to change the visuals for the enemy that we can attack
                        OpponentCharacter.forEach(char => {
                            char.setInteractive(true)
                            char.tint = 5 * 0xffffff;                         
                        })
                    }
                }else{
                    //If the skill has a cooldown
                    selectedSkill = undefined;                       
                        OpponentCharacter.forEach(char => {
                            char.setInteractive(true)
                            char.clearTint();                         
                        })
                    console.log("you have a cooldown on this skill")
                }
                
                
            }else{
                console.log("you have already used 1 skill for this character this turn")
            }
        })
      



        char1_skill1.on("pointerdown", () => { 
            if(char1_skill1.skill.skill.selfEffect){
                selectedSkill = char1_skill1.skill.skill
                this.socket.emit("use", char1_skill1.skill.skill, char1.stats);                
            }else{
                this.socket.emit("clickSkill",char1_skill1.skill, char1.stats)
                console.log(char1_skill1.skill)            
            }
        })

        char1_skill1.on("pointerover", () => {      
            onHoverSkill(char1_skill1)
        })

        char1_skill1.on("pointerout", () => {
            removeSkillText()
        })

        char1_skill2.on("pointerdown", () => {
            if(char1_skill2.skill.skill.selfEffect){
                selectedSkill = char1_skill2.skill.skill
                this.socket.emit("use", char1_skill2.skill.skill, char1.stats);
            }else{
                this.socket.emit("clickSkill",char1_skill2.skill, char1.stats)
            }
        })

        char1_skill2.on("pointerover", () => {      
            onHoverSkill(char1_skill2)
        })

        char1_skill2.on("pointerout", () => {
            removeSkillText();
        })

        char1_skill3.on("pointerdown", () => {
            if(char1_skill3.skill.skill.selfEffect){
                selectedSkill = char1_skill3.skill.skill
                this.socket.emit("use", char1_skill3.skill.skill, char1.stats);
            }else{
                this.socket.emit("clickSkill",char1_skill3.skill, char1.stats)
            }
        })     

        char1_skill3.on("pointerover", () => {      
            onHoverSkill(char1_skill3)
        })

        char1_skill1.on("pointerout", () => {
            removeSkillText();
        })

        char1_skill4.on("pointerdown", () => {            
            if(char1_skill4.skill.skill.selfEffect){
                selectedSkill = char1_skill4.skill.skill
                this.socket.emit("use", char1_skill4.skill.skill, char1.stats);
            }else{
                this.socket.emit("clickSkill",char1_skill4.skill, char1.stats)
            }
        })     

        char1_skill4.on("pointerover", () => {
            onHoverSkill(char1_skill4)
        })

        char1_skill1.on("pointerout", () => {
            removeSkillText()
        })
        
        char2_skill1.on("pointerdown", () => {                         
            if(char2_skill1.skill.skill.selfEffect){
                selectedSkill = char2_skill1.skill.skill
                this.socket.emit("use", char2_skill1.skill.skill, char2.stats);
            }else{                   
                this.socket.emit("clickSkill",char2_skill1.skill, char2.stats)
            }
        })

        char2_skill1.on("pointerover", () => {
            onHoverSkill(char2_skill1)
        })

        char2_skill1.on("pointerout", () => {
            removeSkillText()
        })
                
        char2_skill2.on("pointerdown", () => {
            if(char2_skill2.skill.skill.selfEffect){
                selectedSkill = char2_skill2.skill.skill
                this.socket.emit("use", char2_skill2.skill.skill, char2.stats);
            }else{
                this.socket.emit("clickSkill",char2_skill2.skill, char2.stats)
            }
            
        })

        char2_skill2.on("pointerover", () => {
            onHoverSkill(char2_skill2)
        })

        char2_skill2.on("pointerout", () => {
            removeSkillText()
        })

        char2_skill3.on("pointerdown", () => {           
            if(char2_skill3.skill.skill.selfEffect){
                selectedSkill = char2_skill3.skill.skill
                this.socket.emit("use", char2_skill3.skill.skill, char2.stats);
            }else{
                this.socket.emit("clickSkill",char2_skill3.skill, char2.stats)
            }
            
        })  

        char2_skill3.on("pointerover", () => {
            onHoverSkill(char2_skill3)
        })

        char2_skill3.on("pointerout", () => {
            removeSkillText()
        })

        char2_skill4.on("pointerdown", () => {            
            if(char2_skill4.skill.skill.selfEffect){
                selectedSkill = char2_skill4.skill.skill
                this.socket.emit("use", char2_skill4.skill.skill, char2.stats);
            }else{
                this.socket.emit("clickSkill",char2_skill4.skill, char2.stats)
            }
        }) 

        char2_skill4.on("pointerover", () => {
            onHoverSkill(char2_skill4)
        })

        char2_skill4.on("pointerout", () => {
            removeSkillText()
        })

        char3_skill1.on("pointerdown", () => {             
            if(char3_skill1.skill.skill.selfEffect){
                selectedSkill = char3_skill1.skill.skill
                this.socket.emit("use", char3_skill1.skill.skill, char3.stats);
            }else{       
                this.socket.emit("clickSkill",char3_skill1.skill, char3.stats)
            }
        })

        char3_skill1.on("pointerover", () => {
            onHoverSkill(char3_skill1)
        })

        char3_skill1.on("pointerout", () => {
            removeSkillText()
        })

        char3_skill2.on("pointerdown", () => {            
            if(char3_skill2.skill.skill.selfEffect){
                selectedSkill = char3_skill2.skill.skill
                this.socket.emit("use", char3_skill2.skill.skill, char3.stats);
            }else{
                this.socket.emit("clickSkill",char3_skill2.skill, char3.stats)
            }
            
        })

        char3_skill2.on("pointerover", () => {
            onHoverSkill(char3_skill2)
        })

        char3_skill2.on("pointerout", () => {
            removeSkillText()
        })

        char3_skill3.on("pointerdown", () => {            
            if(char3_skill3.skill.skill.selfEffect){
                selectedSkill = char3_skill3.skill.skill
                this.socket.emit("use", char3_skill3.skill.skill, char3.stats);
            }else{
            this.socket.emit("clickSkill",char3_skill3.skill, char3.stats)
            }
            
        })  

        char3_skill3.on("pointerover", () => {
            onHoverSkill(char3_skill3)
        })

        char3_skill3.on("pointerout", () => {
            removeSkillText()
        })

        char3_skill4.on("pointerdown", () => {            
            if(char3_skill4.skill.skill.selfEffect){
                selectedSkill = char3_skill4.skill.skill
                this.socket.emit("use", char3_skill4.skill.skill, char3.stats);
            }else{
                this.socket.emit("clickSkill",char3_skill4.skill, char3.stats)
            }
        }) 

        char3_skill4.on("pointerover", () => {
            onHoverSkill(char3_skill4)
        })

        char3_skill4.on("pointerout", () => {
            removeSkillText()
        })
        
        char4_skill1.on("pointerdown", () => {           
            if(char4_skill1.skill.skill.selfEffect){
                selectedSkill = char4_skill1.skill.skill
                this.socket.emit("use", char4_skill1.skill.skill, char4.stats);
            }else{
                this.socket.emit("clickSkill",char4_skill1.skill, char4.stats)
            }
            
        }) 

        char4_skill1.on("pointerover", () => {
            onHoverSkill(char4_skill1)
        })

        char4_skill1.on("pointerout", () => {
            removeSkillText()
        })

        char4_skill2.on("pointerdown", () => {            
            if(char4_skill2.skill.skill.selfEffect){
                selectedSkill = char4_skill2.skill.skill
                this.socket.emit("use", char4_skill2.skill.skill, char4.stats);
            }else{
            this.socket.emit("clickSkill",char4_skill2.skill, char4.stats)
            }
        }) 

        char4_skill2.on("pointerover", () => {
            onHoverSkill(char4_skill2)
        })

        char4_skill2.on("pointerout", () => {
            removeSkillText()
        })

        char4_skill3.on("pointerdown", () => {            
            if(char4_skill3.skill.skill.selfEffect){
                selectedSkill = char4_skill3.skill.skill
                this.socket.emit("use", char4_skill3.skill.skill, char4.stats);
            }else{
            this.socket.emit("clickSkill",char4_skill3.skill, char4.stats)
            }
        }) 

        char4_skill3.on("pointerover", () => {
            onHoverSkill(char4_skill3)
        })

        char4_skill3.on("pointerout", () => {
            removeSkillText()
        })

        char4_skill4.on("pointerdown", () => {            
            if(char4_skill4.skill.skill.selfEffect){
                selectedSkill = char4_skill4.skill.skill
                this.socket.emit("use", char4_skill4.skill.skill, char4.stats);
            }else{
                this.socket.emit("clickSkill",char4_skill4.skill, char4.stats)
            }
        }) 

        char4_skill4.on("pointerover", () => {
            onHoverSkill(char4_skill4)
        })

        char4_skill4.on("pointerout", () => {
            removeSkillText()
        })


        char3Effect1.on("pointerover", () =>{            
            onHoverEffect(char3, 1)
        })

        char3Effect1.on("pointerout", () =>{            
            unHoverEffect()
        })


        

        endTurnText.on("pointerdown", () => {            
            this.socket.emit("endTurn", usedSkillsThisRound)
        })  

        
        // char3_skill1.on("pointerdown", () => { 
                   
        //     this.socket.emit("clickSkill",char3_skill1.skill, char3.stats)
        //     console.log(char3_skill1.skill)
        // })

        // char3_skill2.on("pointerdown", () => {
        //     this.socket.emit("clickSkill",char3_skill2.skill, char3.stats)
        // })

        // char3_skill3.on("pointerdown", () => {
        //     this.socket.emit("clickSkill",char3_skill3.skill, char3.stats)
        // })  

        char1.on('pointerup', () => {               
            console.log(selectedSkill) 
            if(selectedSkill !== undefined){                
                this.socket.emit("use", selectedSkill, char1.stats); 
            }           
        })

        char2.on('pointerup', () => { 
            console.log(selectedSkill)    
            if(selectedSkill !== undefined){
                this.socket.emit("use", selectedSkill, char2.stats);
            }            
        })

        char3.on('pointerup', () => {    
            console.log(selectedSkill) 
            if(selectedSkill !== undefined){           
                this.socket.emit("use", selectedSkill, char3.stats);
            }
        })   


        char4.on('pointerup', () => {    
            console.log(selectedSkill) 
            if(selectedSkill !== undefined){                
                this.socket.emit("use", selectedSkill, char4.stats); 
            }           
        })

        char5.on('pointerup', () => { 
            console.log(selectedSkill)    
            if(selectedSkill !== undefined){
                this.socket.emit("use", selectedSkill, char5.stats);
            }            
        })

        char6.on('pointerup', () => {    
            console.log(selectedSkill) 
            if(selectedSkill !== undefined){           
                this.socket.emit("use", selectedSkill, char6.stats);
            }
        })     

        this.socket.on("gotData", function(character){
            console.log(character)
        })

        physical.on('pointerup', () => {
           
            //We should probably make a function to update the energy, but i cba atm
            randomSelect = "physical"
                           
        })

        this.socket.on("removeEnergy", (energy) => {            
            this.socket.emit("removeEnergy", energy);   
        })

        this.socket.on("removeEnergyNow", (energy, returnAmount) => {
            let energyAmount = Energy[energy];
            Energy[energy] = 0 
            if(returnAmount){
                this.socket.emit("returnEnergyAmount", energyAmount); 
            }
        })

        //CHANGE. We can store the amount of energy they have removed. now we just need to add a buff with the correct damage reduction
        this.socket.on("removeEnergyAmount", (amount) => {
            console.log("You have removed " + amount + " magic energy from the opponent")
            
        })

        this.socket.on("use", (skill, character) => {
            console.log("bb cock")
            if(myTurn){
                useSkill(skill, character)
                this.socket.emit("sendEffectData", skill, character);
            }
            
        })  

        this.socket.on("returnCalculated", function(info){
            getSkillCalculation(info)
        })

        this.socket.on("sendEffectData", function(effects){
            Object.keys(effects).forEach(function(key){
                
                updateEffects(effects[key].skill, effects[key].character)
                updateEffectVisuals(effects[key].skill, effects[key].character)
            })
            console.log(effects)
        })
        
        this.socket.on("updateDamageDoneTo", function(effect, char){
            console.log("You used " + effect + " on " + char)
        })

        //We probably want to change this so it actually works how we want it to. atm it just generates random number between 0-5 for each energy type
        function randomizeAndUpdateEnergy(){

            let firstRandom = Math.floor(Math.random() * 6)
            let secondRandom = Math.floor(Math.random() * 6)

            let arrayIteration = -1;
            Object.keys(Energy).forEach(en =>{
                arrayIteration++
                if(arrayIteration === firstRandom){
                    Energy[en] += 1
                    firstRandom = null; 
                }
                if(arrayIteration === secondRandom){
                    Energy[en] += 1
                    secondRandom = null; 
                }           
            })
            updateEnergy();
        }
        
        function updateEnergy(){
            physical.setText("Physical: " + Energy.physical);
            magic.setText("Magic: " + Energy.magic);
            strategy.setText("Strategy: " + Energy.strategy);
            agility.setText("Agility: " + Energy.agility);
            unique.setText("Unique: " + Energy.unique);
            support.setText("Support: " + Energy.support);
        }

        function useSkill (skill, character){
            
            //This is when the player wants to use a skill 
            console.log(character)           
            let haveEnergy = true;
            //This pretty much doesnt matter because we have already disabled the ability to use skills with cool downs before
            //But we must error check just in case, you never know when someone might be able to do something
            if(skill.currentCoolDown === 0){  
                //if there is no cooldown on the skill
                //We want to check if they have the energy to be able to use 
                let energyType = skill.cost; // This is the energy types of the skill. Most of them are 0 so we want to loop through and remove the 0 values
                let totalEnergy = 0; 
                let energyCostTotal = skill.cost.total
                let randomAmount = 0; // This will be for the RANDOM energy type. We want to know if they have enough energy to be able to use the RANDOM.
                let energyAmountWithoutRandom = 0;
                let energyToUse = [];
                let energyObj = {};
                let isRandom = false;

                Object.keys(Energy).forEach(type => {
                    if(Energy[type] !== 0){                        
                        totalEnergy += Energy[type]
                                         
                    }
                })


                Object.keys(energyType).forEach(type => {
                    if(energyType[type] !== 0){   
                        if(type !== "total" && type !== "random"){
                            energyObj[type] = energyType[type]
                            
                        }                                          
                        if(type == "random"){   
                            isRandom = true;                         
                            randomAmount = energyType[type]
                            console.log("Random Energy")                                                      
                        }else{
                            energyAmountWithoutRandom += energyType[type];
                        }                 
                        if(energyType[type] > Energy[type]){                 
                            console.log("Not enough Energy")
                            haveEnergy = false;
                            return
                        }else{
                                              
                        }                  
                    }
                })
                

                if(haveEnergy){                    
                    if(energyAmountWithoutRandom + randomAmount > totalEnergy){
                        console.log("you don't have enough to use random")
                        haveEnergy = false;
                    }

                    if(haveEnergy){
                        usedSkillsThisRound.push({
                            skill: skill,
                            character: character
                        })

                        let characterUsedOn = undefined
                        let characterEffect = [];
                        Object.keys(characters).forEach(char => {
                            
                            if(selectedSkill.character === characters[char].stats.name){
                                characterUsedOn = characters[char].stats.charNumber;
                                //console.log(characters.skillUsed)
                            }
                        })
                        characterEffect = selectedSkill
                        
                        updateEffectVisuals(skill, character)
                        scene.socket.emit("calculateDamage", characterEffect, character)
                        console.log("you used "+ JSON.stringify(skill) + " on "+ JSON.stringify(character))
                        updateEffects(skill, character);
                        clearAllVisuals();
                        

                        Object.keys(energyObj).forEach(energy => {
                            Energy[energy] -= energyObj[energy];
                            //We should probably make a function to update the energy, but i cba atm
                            updateEnergy();
                                               
                        })

                        if(isRandom){
                            Energy["physical"] -= randomAmount;
                            updateEnergy();
                        }
                        
                        Object.keys(characters).forEach(char => {
                            console.log(selectedSkill.character)
                            if(selectedSkill.character === characters[char].stats.name){
                                console.log(characters[char].stats.skillUsed )
                                characters[char].stats.skillUsed = true;
                                console.log(characters[char].stats.skillUsed)
                                //console.log(characters.skillUsed)
                            }
                        })
                        

                        allSkills.forEach(skills => {

                            //loop through the skill so we can find the variable holding our skill we want to use 
                            console.log(JSON.stringify(skill))                   
                            if(JSON.stringify(skills.skill.skill) == JSON.stringify(skill)){  
                                //finds and updates the cooldown                      
                                skills.skill.skill.currentCoolDown = skill.coolDownDuration;
                                //unselect the skill
                                selectedSkill = undefined;
                                //remove visuals
                                skills.clearTint();
                                //now we say that that character has used a skill this turn already
                               
                                
                                
                                
                                //loop through the enemies so we can remove the visuals
                                OpponentCharacter.forEach(char => {
                                    char.setInteractive(true)
                                    char.clearTint(); 
                                    // for(let i = 0; i < characters.length; i++){                                        
                                    //     char1_cooldowns[i].setText("CD: " + character1Skills[i].skill.currentCoolDown)

                                    // }    
                                                      
                                })
                                    
                                    setCoolDownText(isPlayerA)  
                                
                            }
                        });
                    }
                }else{
                    console.log("you dont have enough energy")
                }         
                
                
                //skill.currentCoolDown = skill.coolDownDuration;   
                 
            }else{
                console.log("you have a cooldown on this skill")
            }
        }

        function clearAllVisuals(){
            
            allSkills.forEach(skill => {
                skill.clearTint()   
            })
            OpponentCharacter.forEach(char =>{
                char.clearTint()   
            })
            
        }

        function updateOnSkillClick(skill, character, clear){
            if(clear){
                //remove tint

            }
            if(!clear){
                switch(character.charNumber){
                    case 1:
                        character1Skills.forEach(skills => {  
                            //we clear all the tints  
                                                                     
                            if(JSON.stringify(skills.skill.skill) == JSON.stringify(skill)){ 
                                //Then we find the actual skill they want to use                                
                                skills.tint = 100 * 0xffffff; 
                                return;  
                            }
                        })
                        break;
                    case 2:
                        character2Skills.forEach(skills => {  
                            //we clear all the tints                            
                            if(JSON.stringify(skills.skill.skill) == JSON.stringify(skill)){ 
                                console.log(character2Skills)
                                //Then we find the actual skill they want to use                                
                                skills.tint = 100 * 0xffffff; 
                                return;  
                            }
                        })
                        break;
                    case 3:
                        character3Skills.forEach(skills => {  
                            //we clear all the tints                                             
                            if(JSON.stringify(skills.skill.skill) == JSON.stringify(skill)){ 
                                //Then we find the actual skill they want to use                                
                                skills.tint = 100 * 0xffffff; 
                                return;  
                            }
                        })
                        break;
                    case 4:
                        character4Skills.forEach(skills => {  
                        //we clear all the tints                                             
                            if(JSON.stringify(skills.skill.skill) == JSON.stringify(skill)){ 
                                //Then we find the actual skill they want to use                                
                                skills.tint = 100 * 0xffffff; 
                                return;  
                            }
                        })
                        break;
                    
                }

            }
        }

        function setCoolDownText(checkPlayer){
            //For some reason isPlayerA is false for both players here. So we just check if the Character4 has skills in the array. If so then its player2 if not its playerA
            if(character4Skills.length === 0){
                for(let i = 0; i < char1_cooldowns.length; i++){                                        
                    char1_cooldowns[i].setText("CD: " + character1Skills[i].skill.skill.currentCoolDown)
                    char2_cooldowns[i].setText("CD: " + character2Skills[i].skill.skill.currentCoolDown)
                    char3_cooldowns[i].setText("CD: " + character3Skills[i].skill.skill.currentCoolDown)
                    //char3_cooldowns[i].setText("CD: " + character3Skills[i].skill.currentCoolDown)
                }  
            }else{
                for(let i = 0; i < char4_cooldowns.length; i++){
                    char4_cooldowns[i].setText("CD: " + character4Skills[i].skill.skill.currentCoolDown) 
                }                   
            }
        }

        function UpdateCoolDown(){
            characters.forEach(char => {
                char.stats.skillUsed = false;
            })
            allSkills.forEach(skill => {
                if(skill.skill.skill.currentCoolDown > 0){
                    skill.skill.skill.currentCoolDown -= 1;
                }
            })
            setCoolDownText()
        }
        
        function updateEffects(skill, character){                     
            console.log("updating effects")
            let charNum = character.charNumber;
                   
            
            let index = 0    
            let finished = false;  
            while(!finished){      
                character.effect.forEach(effect => {  
                console.log(effect)                    
                    if(Object.keys(effect).length === 0){   
                        console.log(charNum)               
                        switch(charNum){
                            case 1:
                                char1.stats.effect[index] = skill
                                finished = true;
                                break;
                            case 2:
                                char2.stats.effect[index] = skill
                                finished = true;
                                break;
                            case 3:
                                char3.stats.effect[index] = skill
                                finished = true;
                                break;
                            case 4:
                                char4.stats.effect[index] = skill
                                console.log(char4.stats.effect)
                                finished = true;
                                break;
                            case 5:
                                char5.stats.effect[index] = skill
                                finished = true;
                                break;
                            case 6:
                                char6.stats.effect[index] = skill
                                finished = true;
                                break;
                        }                    
                    }else{
                        index++
                    }                                
                })
            }           
        }

        function updateEffectDuration(){
            
            characters.forEach(char => {                
                char.stats.effect.forEach(effect =>{
                    console.log(effect[Object.keys(effect)])
                    if(Object.values(effect)[0] !== undefined || effect[Object.keys(effect)] !== undefined || effect === undefined){
                        effect.duration -= 1;
                        console.log(effect.duration)
                        if(char.stats.effect[0].duration === 0){
                            char.stats.effect[0] = {}
                            removeVisuals(effect, char)
                        }
                        if(char.stats.effect[1].duration === 0){
                            char.stats.effect[1] = {}
                            removeVisuals(effect, char)
                        }
                        if(char.stats.effect[2].duration === 0){
                            char.stats.effect[2] = {}
                            removeVisuals(effect, char)
                        }
                        if(char.stats.effect[3].duration === 0){
                            char.stats.effect[3] = {}
                            removeVisuals(effect, char)
                        }
                    }
                })
            })

            OpponentCharacter.forEach(char => {                              
                char.stats.effect.forEach(effect =>{   
                    console.log(effect)                                    
                    if(Object.values(effect)[0] !== undefined || effect[Object.keys(effect)] !== undefined || effect === undefined){                        
                        effect.duration -= 1;
                        
                        if(char.stats.effect[0].duration === 0){
                            char.stats.effect[0] = {}
                            removeVisuals(effect, char)
                        }
                        if(char.stats.effect[1].duration === 0){
                            char.stats.effect[1] = {}
                            removeVisuals(effect, char)
                        }
                        if(char.stats.effect[2].duration === 0){
                            char.stats.effect[2] = {}
                            removeVisuals(effect, char)
                        }
                        if(char.stats.effect[3].duration === 0){
                            char.stats.effect[3] = {}
                            removeVisuals(effect, char)
                        }
                    }                    
                })
            })           
        }

        function updateEffectVisuals(effect, character){ 
            let done = false;


            if(character != undefined){

                while(!done){
                    switch(character.charNumber){
                        case 1:
                            if(effect.duration !== 0){                           
                                for(let i = 0; char1effects.length !==i; i++){
                                    if(char1effects[i].texture.key === "effect"){
                                        char1effects[i].setTexture(effect.image).setInteractive()
                                        done = true;
                                        break;
                                    }
                                }                                                            
                            }else{
                                done = true;
                                break;
                            }
                            break;
                        case 2:
                            if(effect.duration !== 0){                           
                                for(let i = 0; char2effects.length !==i; i++){
                                    if(char2effects[i].texture.key === "effect"){
                                        char2effects[i].setTexture(effect.image).setInteractive()
                                        done = true;
                                        break;
                                    }
                                }                                                            
                            }else{
                                done = true;
                                break;
                            }
                            break;
                        case 3:
                            if(effect.duration !== 0){                           
                                for(let i = 0; char3effects.length !==i; i++){
                                    if(char3effects[i].texture.key === "effect"){
                                        char3effects[i].setTexture(effect.image).setInteractive()
                                        done = true;
                                        break;
                                    }
                                }                                                            
                            }else{
                                done = true;
                                break;
                            }
                            break;
                        case 4:
                            if(effect.duration !== 0){                           
                                for(let i = 0; char4effects.length !==i; i++){
                                    if(char4effects[i].texture.key === "effect"){
                                        char4effects[i].setTexture(effect.image).setInteractive()
                                        done = true;
                                        break;
                                    }
                                }                                                            
                            }else{
                                done = true;
                                break;
                            }
                            break;
                        case 5:
                            if(effect.duration !== 0){                           
                                for(let i = 0; char5effects.length !==i; i++){
                                    if(char5effects[i].texture.key === "effect"){
                                        char5effects[i].setTexture(effect.image).setInteractive()
                                        done = true;
                                        break;
                                    }
                                }                                                            
                            }else{
                                done = true;
                                break;
                            }
                            break;
                        case 6:
                            if(effect.duration !== 0){                           
                                for(let i = 0; char6effects.length !==i; i++){
                                    if(char6effects[i].texture.key === "effect"){
                                        char6effects[i].setTexture(effect.image).setInteractive()
                                        done = true;
                                        break;
                                    }
                                }                                                            
                            }else{
                                done = true;
                                break;
                            }
                            break;
                        
                                            
                    }
                }
            }
        }

        function removeVisuals(effect, character){   
            console.log(character)
            switch(character.stats.charNumber){
                case 1:
                    char1effects.forEach(e =>{               
                        if(e.texture.key === effect.image){
                            e.setTexture("effect")
                        }
                    })
                    break;
                case 2:
                    char2effects.forEach(e =>{               
                        if(e.texture.key === effect.image){
                            e.setTexture("effect")
                        }
                    })
                    break;
                case 3:
                    char3effects.forEach(e =>{               
                        if(e.texture.key === effect.image){
                            e.setTexture("effect")
                        }
                    })
                    break;
                case 4:
                    char4effects.forEach(e =>{               
                        if(e.texture.key === effect.image){
                            e.setTexture("effect")
                        }
                    })
                    break;
                case 5:
                    char5effects.forEach(e =>{               
                        if(e.texture.key === effect.image){
                            e.setTexture("effect")
                        }
                    })
                    break;
                case 6:
                    char6effects.forEach(e =>{               
                        if(e.texture.key === effect.image){
                            e.setTexture("effect")
                        }
                    })
                    break;
            }         

        }

        function updateHealthText(){
            for(let i = 0; i < characters.length; i++){                
                charactersHeath[i].setText("Health: " + characters[i].stats.health)
                opponentsHealth[i].setText("Health: " + OpponentCharacter[i].stats.health)
            }            
        }


        function getSkillCalculation(info){            
            console.log(info.charToUseOn + " " + info.damage)
            //If there is damage to be done
            if(info.damage !== 0){
                switch(info.charToUseOn){
                    case 1:
                        char1.stats.health -= info.damage;                    
                        break;
                    case 2:
                        char2.stats.health -= info.damage;
                        break;
                    case 3:
                        char3.stats.health -= info.damage;
                        break;
                    case 4:
                        char4.stats.health -= info.damage;
                        break;
                    case 5:
                        char5.stats.health -= info.damage;
                        break;
                    case 6:
                        char6.stats.health -= info.damage;
                        break;
                }
            }
            //If we need to add a stun effect
            if(info.stun === true){
                switch(info.charToUseOn){
                    case 1:
                        char1.stats.stunned = true;
                        char1.stats.stun_amount = info.stun_amount;                   
                        break;
                    case 2:
                        char2.stats.stunned = true;
                        char2.stats.stun_amount = info.stun_amount;    
                        break;
                    case 3:
                        char3.stats.stunned = true;
                        char3.stats.stun_amount = info.stun_amount;    
                        break;
                    case 4:
                        char4.stats.stunned = true;
                        char4.stats.stun_amount = info.stun_amount;    
                        break;
                    case 5:
                        char5.stats.stunned = true;
                        char5.stats.stun_amount = info.stun_amount;    
                        break;
                    case 6:
                        char6.stats.stunned = true;
                        char6.stats.stun_amount = info.stun_amount;    
                        break;
                }
            }



            if(myTurn){
                updateHealthText()
            }
        }

        function onHoverSkill(skill){
            if(selectedSkill === undefined){
                let cost = "Cost: "
                effectDescTxt.setText("Description: " + skill.skill.skill.description)
                Object.keys(skill.skill.skill.cost).forEach(effectCost => {
                    if(skill.skill.skill.cost[effectCost] > 0){
                        cost += skill.skill.skill.cost[effectCost] + ":" + effectCost + " "
                    }
                })
                effectCostTxt.setText(cost)
            }
        }

        function onClickSkill(skill){
            effectDescTxt.setText("Description: " + skill.skill.description)
            let cost = "Cost: "
            Object.keys(skill.skill.cost).forEach(effectCost => {
                if(skill.skill.cost[effectCost] > 0){
                    cost += skill.skill.cost[effectCost] + ":" + effectCost + " ";
                }
            })
            effectCostTxt.setText(cost)
        }

        function onHoverEffect(character, int){
            if(effectDescTxt != "Description: "){
                savedSkillText = effectDescTxt.text;
                savedCostText = effectCostTxt.text;
            }else{
                savedSkillText = ""
                savedCostText = ""
            }   
           
        }

        function unHoverEffect(){
            if(savedSkillText === ""){
                effectDescTxt.setText("")    
                effectCostTxt.setText("")        
            }else{
                effectDescTxt.setText(savedSkillText)
                effectCostTxt.setText(savedCostText)
            }
        }

        function removeSkillText(){            
            if(selectedSkill === undefined){
                effectDescTxt.setText("")
                effectCostTxt.setText("")
            }
        }

        function onCharacterDeath(){

        }

    }  

    update(){

    }
    

    
}


