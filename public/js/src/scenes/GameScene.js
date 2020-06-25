import {CST} from "/js/src/scenes/CST.js"

//CLIENT SIDE 

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.GAME
        })
    }


    init(){
        
    }

    preload() {
        

    }

    create() {
        var scene = this;

        this.socket = io('http://localhost:1000') // DONT TOUCH THIS. THIS IS THE CONNECTION TO THE SERVER
       
        // We will keep the selected skill. We want to know what skill the character has selected.
        let selectedSkill = {};
        
        //ARRAYS AND OTHER SHIT
        var gameInitiated = false; 
        let isPlayerA = false;
        let turn = false;
        let OpponentCharacter = [];
        let characters = [];
        let charactersHeath = [];
        let character1Skills = [];
        let char1_skills = [];
        let char1_skills_used = false;

        let char1_cooldowns = [];
       
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

        // Declaring the characters. isPlayerA will be (char1, char2, char3) and the other player will be (char4, char5, char6)
        // We should probably move this to the server side, as in, we pass the data of the character from the server.disabled
        // I hard coded it for now for easier testing.disabled
        var char1 = new Character(this, 0,0, "shiro").setScale(0.05, 0.05).setDepth(100).setVisible(false) 
        var char2 = new Character(this, 0,0, "elf").setScale(0.05, 0.05).setDepth(100).setVisible(false)       
        var char3 = new Character(this, 0,0, "ren").setScale(0.05, 0.05).setDepth(100).setVisible(false)   
        
        //Health. The value of this is set further down
        var char1_health = this.add.text(0, 0, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) 
        var char2_health = this.add.text(0, 0, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        var char3_health = this.add.text(0, 0, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        //We put the health in an array for positioning reasons easier to for loop to position them.
        charactersHeath.push(char1_health, char2_health, char3_health) 

        // Characters for the player that is not isPlayerA
        var char4 = new Character(this, 0,0, "girl").setScale(0.05, 0.05).setDepth(100).setVisible(false)         
        var char5 = new Character(this, 0,0, "girl").setScale(0.05, 0.05).setDepth(100).setVisible(false)       
        var char6 = new Character(this, 0,0, "girl").setScale(1, 1).setDepth(100).setVisible(false)
        //health for player 2
        var char4_health = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        var char5_health = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        var char6_health = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        
        //These are the skills for the first character. tbh i dont know the best way to declare them. Maybe we can have JSON for each character with their skills
        // and then declare them like (let char1_skill1 = new Skill(this,0,0, char1.skill.json))
        let char1_skill1 = new Skill(this,0,0, char1.skill.image, "Mirage Step").setDepth(102).setScale(0.03,0.03).setInteractive();
        let char1_skill2 = new Skill(this,0,0, "skill1", "Something Else").setDepth(102).setScale(0.03,0.03).setInteractive();
        let char1_skill3 = new StanceOfDeath(this,0,0, "skill2", "STANCE OF DEATH").setDepth(102).setScale(0.03,0.03).setInteractive();

        let char1_skill1_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char1_skill2_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        let char1_skill3_cooldown = this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' }).setDepth(101).setVisible(false) ;
        char1_cooldowns.push(char1_skill1_cooldown, char1_skill2_cooldown, char1_skill3_cooldown)

        //The energy text. We will change this from text to some ui. This is for testing purposes.
        var testtext = this.add.text(0, 0, 'skill info', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true) ;
        var physical = this.add.text(10, 600, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Physical: " + Energy.physical);
        var magic = this.add.text(160, 600, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Magic: " + Energy.magic);
        var strategy = this.add.text(310, 600, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Strategy: " + Energy.strategy);
        var agility = this.add.text(460, 600, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Agility: " + Energy.agility);
        var unique  = this.add.text(610, 600, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Unique: " + Energy.unique);
        var support = this.add.text(760, 600, '', { font: '"Press Start 2P"' }).setDepth(101).setVisible(true).setColor("#ffffff").setFontSize("14px").setStroke("#000000", 4).setText("Support: " + Energy.support);
        // self.char1_skill3.on('pointerup', () => {
        
        //     this.socket.emit("useSkill", char1_skill3)
        // })

        // WHEN BOTH PLAYERS HAVE CONNECTED!!!
        this.socket.on("playersConnected", function () {
            // We want to check who is player1 and who is player2 that way we can correctly display everything.
            // For example we don't want player1 to be able to see and use player2 skills


            // We use the gameInitiated variable so that we only do this once.
            if(gameInitiated === false){
                if(this.isPlayerA){
                    // Because we made char1,char2,char3 playerA characters, we push them into a characters array.
                    characters.push(char1, char2, char3);
                    //we push the skills into an array too. We will need more arrays, atm its hard coded
                    character1Skills.push(char1_skill1, char1_skill2, char1_skill3);
                    // We declare the opponents characters
                    OpponentCharacter.push(char4,char5,char6)
                }else{
                    //This means you are player2. We flip the characters around.
                    OpponentCharacter.push(char1, char2, char3);
                    characters.push(char4,char5,char6)
                    character1Skills.push(char1_skill1, char1_skill2, char1_skill3);
                    for(let i = 0; i < character1Skills.length; i++){
                        character1Skills[i].setVisible(false)
                    }
                }
                
                //This is to position and modify the different arrays we created.disabled

                for(let i = 0; i < characters.length; i++){
                    
                    characters[i].setOrigin(-1, -2 * [i]).setInteractive().setVisible(true)
                    charactersHeath[i].setVisible(true).setOrigin(-1.6, -9 * [i]).setText("Health: " + characters[i].stats.health).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                    char1_cooldowns[i].setVisible(true).setOrigin((i + 2) * -2.7 ,-0.6).setText("CD: " + character1Skills[i].skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                }
                for(let i = 0; i < OpponentCharacter.length; i++){
                    OpponentCharacter[i].setOrigin(-10, -3 * [i]) .setInteractive().setVisible(true)       
                }    
                for(let i = 0; i < character1Skills.length; i++){
                    character1Skills[i].setOrigin((i + 2) * -1.7 ,-0.6)
                }         
               
                
                //Don't know why im writing this here, but we probably want to create a JSON object server side for each player. We can import data from the database and shit aswell.
                
                //random energy. We should move this to server side. We also need to change this so that it actually does it correctly.disabled
                //atm it's here for testing purposes
                Object.keys(Energy).forEach(en =>{
                    Energy[en] = Math.floor(Math.random() * 6);                
                 })

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
       

        this.socket.on('isPlayerA', function(){
            //First person to join is isPlayerA. We use this to load the characters correctly.
            this.isPlayerA = true;            
            this.turn = true;
        })

        
        this.socket.on('playersConnected', function(){
        })


        // test.on("pointerup", () => {                 
        //     this.socket.emit('ready');
        // })

        //Update the energy. We probably want to change this so its 
        this.socket.on('updateEnergy', function(){                      
            physical.setText("Physical: " + Energy.physical);
            magic.setText("Magic: " + Energy.magic);
            strategy.setText("Strategy: " + Energy.strategy);
            agility.setText("Agility: " + Energy.agility);
            unique.setText("Unique: " + Energy.unique);
            support.setText("Support: " + Energy.support);
        })



        //ONCE THE PLAYER SELECTS A SKILL
        this.socket.on('selectSkill', function(data, skill){   
            console.log(skill.currentCoolDown)          
            if(this.isPlayerA == true && data == "player1" && char1_skills_used === false){  

                //Check if the skill has a cool down
                if(skill.currentCoolDown === 0){
                    //If the skill doesn't have a cool down
                    if(selectedSkill !== undefined && selectedSkill.name == skill.name){
                        //This is if they have clicked the same skill. We want to deselect it.
                        OpponentCharacter.forEach(char => {
                            //We change the enemy characters to normal
                            
                            character1Skills.forEach(skills => {                    
                                if(JSON.stringify(skills.skill) == JSON.stringify(skill)){                        
                                    skills.clearTint();     
                                }
                            })

                            char.clearTint()
                            char.setInteractive(false)
                            selectedSkill = undefined;
                        }) 
                    }else{
                        //This means we can make the selected skill something else, as its not already selected, or there is no selected skill
                            selectedSkill = skill;  

                            //we want to loop through each skill to remove the visuals
                            character1Skills.forEach(skills => {  
                            //we clear all the tints
                            skills.clearTint();                  
                            if(JSON.stringify(skills.skill) == JSON.stringify(skill)){ 
                                //Then we find the actual skill they want to use                                
                                skills.tint = 100 * 0xffffff; 
                                return;  
                            }
                        })

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
      


        char1.on("pointerdown", () => {
            this.socket.emit("getFromDataBase", char1.stats)
        })



        char1_skill1.on("pointerdown", () => { 
                   
            this.socket.emit("clickSkill",char1_skill1.skill)
            console.log(char1_skill1.skill)
        })

        char1_skill2.on("pointerdown", () => {
            this.socket.emit("clickSkill",char1_skill2.skill)
        })

        char1_skill3.on("pointerdown", () => {
            this.socket.emit("clickSkill",char1_skill3.skill)
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

        this.socket.on("use", function(skill, character) {
            //This is when the player wants to use a skill
            console.log(JSON.stringify(skill.currentCoolDown))
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

                Object.keys(Energy).forEach(type => {
                    if(Energy[type] !== 0){                        
                        totalEnergy += Energy[type]
                        console.log("Total energy: " + totalEnergy)                 
                    }
                })


                Object.keys(energyType).forEach(type => {
                    if(energyType[type] !== 0){                                              
                        if(type == "random"){                            
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
                        console.log("you used "+ JSON.stringify(skill) + " on "+ JSON.stringify(character))
                        character1Skills.forEach(skills => {

                            //loop through the skill so we can find the variable holding our skill we want to use                    
                            if(JSON.stringify(skills.skill) == JSON.stringify(skill)){  
                                //finds and updates the cooldown                      
                                skills.skill.currentCoolDown = skill.coolDownDuration;
                                //unselect the skill
                                selectedSkill = undefined;
                                //remove visuals
                                skills.clearTint();
                                //now we say that that character has used a skill this turn already
                                char1_skills_used = true;
                                //loop through the enemies so we can remove the visuals
                                OpponentCharacter.forEach(char => {
                                    char.setInteractive(true)
                                    char.clearTint(); 
                                    for(let i = 0; i < characters.length; i++){
                                        char1_cooldowns[i].setVisible(true).setOrigin((i + 2) * -2.7 ,-0.6).setText("CD: " + character1Skills[i].skill.currentCoolDown).setColor("#FA4D57").setFontSize("20px").setStroke("#000000", 4)
                                    }                        
                                })

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
            
        })  
    }  

    update(){

    }
    

    
}


