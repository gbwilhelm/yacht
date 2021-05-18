//default component in game area
Vue.component('game-welcome',{
  template: '<div>\
            <h1>Welcome to Yacht!</h1>\
            <p>When ready, click \"Start Game\"<br>\
            To review the rules at any time, click \"Rules\" at the top-right of the page.</p>\
            <button v-on:click=\"$emit(\'start-game\')\">Start Game</button>\
            </div>'
})

//game loop component, passes signals from dice component to main app
Vue.component('game-main',{
  data: function(){
    return{
      mainState: 0 //0 is rolling dice, 1 is scoring
    }
  },
  methods:{
    rolled: function(){
      this.$emit("rolled")
    },
    beginScoring: function(roll){
      console.log("begin scoring phase")
      this.mainState = 1
      this.$refs.scoreCalculator.calculateScores(roll)
    },
    scoreConfirmed: function(choice,scores){
      this.mainState = 0
      this.$emit("score-confirmed",choice)
      //start next roll after emit is done
      this.$refs.scoreboard.updateScores(scores)
      this.$refs.dice.rollDice()
    }
  },
  template: '<div>\
            <p>MAIN GAME LOOP...</p>\
            <p>mainState: {{mainState}}</p>\
            <dice ref="dice" v-on:rolled="rolled" v-on:begin-scoring="beginScoring"></dice>\
            <scoreCalculator ref="scoreCalculator" v-show="mainState===1" v-on:score-confirmed="scoreConfirmed"></scoreCalculator>\
            <scoreboard ref="scoreboard"></scoreboard>\
            </div>'
})

//component displays dice roll, also shows scoring categories, signals sent to game-main component
Vue.component('dice',{
  data: function(){
    return{
      diceRoll: [1,1,1,1,1],
      diceChosen: [false,false,false,false,false],
      diceLocked: [false,false,false,false,false],
      imgPaths: ["img/dice_1.png","img/dice_1.png","img/dice_1.png","img/dice_1.png","img/dice_1.png"],
      imgIndex: 9 //index in imgPaths of the image number
    }
  },
  beforeMount(){
    this.rollDice()
  },
  methods: {
    rollDice: function(){
      console.log("rolling dice... (roll number"+this.$parent.$parent.rollNumber+")")
      //unlock all dice before first roll of round
      if(this.$parent.$parent.rollNumber===0 || this.$parent.$parent.rollNumber===3){
        console.log("first roll, unlocking all dice")
        this.diceLocked.forEach((val,i)=>{
          if(val){
            let dice = document.getElementById("dice"+i)
            dice.className = "dice"
            dice.children[1].firstChild.className = "fas fa-lock-open"
            this.diceLocked[i]=false
          }
        })
      }
      //roll all unlocked dice
      this.diceLocked.forEach((val,i)=>{
        if(!val){
          this.diceRoll[i] = getRandomInt(1,7)
          this.imgPaths[i] = this.imgPaths[i].substr(0,this.imgIndex)+this.diceRoll[i]+this.imgPaths[i].substr(this.imgIndex+1,this.imgPaths[i].length)
        }
      })
      this.$forceUpdate()
      this.$emit("rolled") //will increment roll count to 1 2 or 3
      //lock all dice after third roll of round
      if(this.$parent.$parent.rollNumber===3){
        console.log("Last roll detected, locking remaining dice")
        this.diceLocked.forEach((val,i)=>{
          if(!val){
            let dice = document.getElementById("dice"+i)
            dice.className = "diceLocked"
            dice.children[1].firstChild.className = "fas fa-lock"
            this.diceLocked[i]=true
          }
        })
        this.$forceUpdate()
        this.$emit("begin-scoring",this.diceRoll)
      }
    },
    toggleDice: function(d){
      if(!this.diceLocked[d]){
        let dice = document.getElementById("dice"+d)
        if(!this.diceChosen[d]){
          dice.className = "diceChosen"
          dice.children[1].firstChild.className = "fas fa-unlock"
        }else{
          dice.className = "dice"
          dice.children[1].firstChild.className = "fas fa-lock-open"
        }
        this.diceChosen[d] = !this.diceChosen[d]
      }
    },
    confirmRoll: function(){
      var chosen = this.diceChosen.flatMap((val,i)=>val?i:[]) //get index of chosen dice
      chosen.forEach( i => {
        let dice = document.getElementById("dice"+i)
        dice.className = "diceLocked"
        dice.children[1].firstChild.className = "fas fa-lock"
        this.diceLocked[i] = true //temp code, no need to change in future since parent object will change it
        this.diceChosen[i] = false //deselect dice
      })
      this.rollDice() //prepare next roll
    }
  },
  template: '<div id=diceComponent>\
            <p>Your Roll</p>\
            <p v-show="this.$parent.mainState===0">Choose which dice you want to keep, the rest will be rerolled.</p>\
            <p v-show="this.$parent.mainState===1">Choose which category you want to score in.</p>\
            <div id=diceImageContainer>\
              <figure id=dice0 class=dice><img v-bind:src=imgPaths[0] width=100 height=100 v-on:click="toggleDice(0)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
              <figure id=dice1 class=dice><img v-bind:src=imgPaths[1] width=100 height=100 v-on:click="toggleDice(1)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
              <figure id=dice2 class=dice><img v-bind:src=imgPaths[2] width=100 height=100 v-on:click="toggleDice(2)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
              <figure id=dice3 class=dice><img v-bind:src=imgPaths[3] width=100 height=100 v-on:click="toggleDice(3)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
              <figure id=dice4 class=dice><img v-bind:src=imgPaths[4] width=100 height=100 v-on:click="toggleDice(4)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
            </div>\
            <div id=diceComponentSub v-show="this.$parent.mainState===0"><button v-on:click="confirmRoll">Confirm Roll</button></div>\
            </div>'
})

//contains logic for calculating scoring categories and values
Vue.component('scoreCalculator',{
  data: function(){
    return {
      possibleCategories: [], //available scoring categories
      allCategories: [{name:'Ones',code:0,score:-1},{name:'Twos',code:1,score:-1},{name:'Threes',code:2,score:-1}, //all categories
                      {name:'Fours',code:3,score:-1},{name:'Fives',code:4,score:-1},{name:'Sixes',code:5,score:-1},{name:'Bonus',code:6,score:35},
                      {name:'Full House',code:7,score:-1},{name:'Four-of-a-Kind',code:8,score:-1},{name:'Little Straight',code:9,score:30},
                      {name:'Big Straight',code:10,score:30},{name:'Choice',code:11,score:-1},{name:'Yacht',code:12,score:50}],
      choice: "", //selected category
      scores: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] //player's score array
    }
  },
  methods: {
    equals: function(arr1,arr2){
        if(arr1.length!=arr2.length)return false
        for(let i=0; i<arr1.length; i++){
          if(arr1[i]!=arr2[i])return false
        }
        return true
    },
    //,ported from Java, tests category detection
    testMethods: function(){
      var dice;
      var expected; var result;

      //Full House
      expected = [true,false,false,true,false,false, false, true,false,false,false,true,false]
      console.log("Testing Full House Detection (Same Expected Set)");
          console.log("\tTest Array: [1,1,1,4,4]");
              dice = [1,1,1,4,4]; //sorted 3-2
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[7])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [1,4,1,1,4]");
              dice = [1,4,1,1,4]; //randomized
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[7])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [1,4,1,4,1]");
              dice = [1,4,1,4,1]; //randomized
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[7])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [4,4,1,1,1]");
              dice = [4,4,1,1,1]; //sorted 2-3
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[7])console.log("ED OTHER CATEGORY");
                  console.log();
              }

      //Yacht
      console.log("Testing Yacht Detection, Contains Four-of-a-Kind");
          console.log("\tTest Array: [2,2,2,2,2]");
              expected = [false,true,false,false,false,false, false, false,true,false,false,true,true];
              dice = [2,2,2,2,2]; //2s
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[12])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [5,5,5,5,5]");
              expected = [false,false,false,false,true,false, false, false,true,false,false,true,true];
              dice = [5,5,5,5,5]; //5s
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[12])console.log("ED OTHER CATEGORY");
                  console.log();
              }
      //Four-of-a-Kind, 4 matches
      console.log("Testing Four-of-a-Kind Detection");
          console.log("\tTest Array: [6,5,5,5,5]");
              expected = [false,false,false,false,true,true, false, false,true,false,false,true,false];
              dice = [6,5,5,5,5]; //sorted 1-4
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[8])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [4,4,4,4,1]");
              expected = [true,false,false,true,false,false, false, false,true,false,false,true,false];
              dice = [4,4,4,4,1]; //sorted 4-1
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[8])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [2,2,2,3,2]");
              expected = [false,true,true,false,false,false, false, false,true,false,false,true,false];
              dice = [2,2,2,3,2]; //mixed
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[8])console.log("ED OTHER CATEGORY");
                  console.log();
              }
      //Little Straight
      expected = [true,true,true,true,true,false, false, false,false,true,false,true,false];
      console.log("Testing Little Straight Detection (Same Expected Set)");
          console.log("\tTest Array: [1,2,3,4,5]");
              dice = [1,2,3,4,5]; //sorted
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[9])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [5,4,3,2,1]");
              dice = [5,4,3,2,1]; //reverse sorted
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[9])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [2,4,1,5,3]");
              dice = [2,4,1,5,3]; //randomized
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[9])console.log("ED OTHER CATEGORY");
                  console.log();
              }
      //Big Straight
      expected = [false,true,true,true,true,true, false, false,false,false,true,true,false];
      console.log("Testing Big Straight Detection (Same Expected Set)");
          console.log("\tTest Array: [2,3,4,5,6]");
              dice = [2,3,4,5,6]; //sorted
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[10])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [6,5,4,3,2]");
              dice = [6,5,4,3,2]; //reverse sorted
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[10])console.log("ED OTHER CATEGORY");
                  console.log();
              }
          console.log("\tTest Array: [2,4,6,5,3]");
              dice = [2,4,6,5,3]; //randomized
              result = this.calculateRollOptions(dice);
              if(this.equals(expected,result)){console.log("\tPASS");}else{
                  console.log("\tFAIL");
                  if(result[10])console.log("ED OTHER CATEGORY");
                  console.log();
              }
    },
    //entrypoint from game-main, fills possibleCategories using data from roll and allCategories
    calculateScores: function(roll){
      console.log(roll)
      this.possibleCategories.splice(0) //needed for Vue to update render
      this.possibleCategories = []
      let result = this.calculateRollOptions(roll)
      this.allCategories.forEach((val,i)=>{
        val.score = this.calculateRollScore(i,roll)
        if(result[i])this.possibleCategories.push(val)
      })
      if(!this.possibleCategories){
        this.scores.forEach((val,i)=>{
          if(val<0 && i != 6){ //skip bonus category, -1 means the category is unscored
            let temp = this.allCategories[i]; temp.score = 0
            this.possibleCategories.push(temp)
          }
        })
      }
      console.log(roll)
    },
    confirmScore: function(){
      this.$emit("score-confirmed",this.choice,this.scores)
      this.choice=""
    },
    //ported from Java version, returns mask of valid scoring categories
    calculateRollOptions: function(diceRoll){
      var flags = [false,false,false,false,false,false,false,false,false,false,false,false,false]
      var f = false
      //ones through sixes
      for(let i=0; i<6; i++){
          if(this.scores[i]<0){
              if(this.calculateRollOptionNumeric(i+1,diceRoll)){
                  flags[i]=true; f=true
              }
          }
      }
      //full house
      if(this.scores[7]<0){
          let first=-1; let firstCount=0
          let second=-1; let secondCount=0
          for(let i=0; i<diceRoll.length; i++){
            if(diceRoll[i] === first){
                firstCount++
            }else if(diceRoll[i]===second){
                secondCount++
            }else if(first===-1){
                first=diceRoll[i]; firstCount++
            }else{
                if(second===-1 && diceRoll[i]!=first){
                    second=diceRoll[i]; secondCount++
                }else{
                    if(diceRoll[i] != first && diceRoll[i] != second){ //third number detected
                        break
                    }
                }
            }
          }
          if(firstCount===3&&secondCount===2 || secondCount===3&&firstCount===2){
              flags[7]=true; f=true
          }
      }
      //four-of-a-kind
      if(this.scores[8]<0){
          let primary //primary is a double match
          if(diceRoll[0]===diceRoll[1]){
              primary = diceRoll[0]
          }if(diceRoll[0]===diceRoll[2]){
              primary = diceRoll[0]
          }else if(diceRoll[1] === diceRoll[2]){
              primary = diceRoll[1]
          }else{
              primary = -1 //first 3 dice are unique, thus no four-of-a-kind
          }

          if(primary!=-1){
              let b1=false//flag for first mismatch
              let b2=false//flag for second mismatch
              for(let i=0; i<diceRoll.length; i++){
                  if(diceRoll[i]!=primary){
                      if(b1){
                          b2=true; break
                      }else{
                          b1=true //two numbers did not match primary
                      }
                  }
              }
              if(!b2){
                  flags[8]=true; f=true
              }
          }
      }
      //sort for easier processing
      diceRoll.sort((a,b) => a-b)
      //little straight
      if(this.scores[9]<0){
          if(diceRoll[0]===1 && diceRoll[1]===2 && diceRoll[2]===3
              && diceRoll[3]===4 && diceRoll[4]===5){
                  flags[9]=true; f=true
              }
      }
      //big straight
      if(this.scores[10]<0){
          if(diceRoll[0]===2 && diceRoll[1]===3 && diceRoll[2]===4
              && diceRoll[3]===5 && diceRoll[4]===6){
                  flags[10]=true; f=true
              }
      }
      //choice
      if(this.scores[11]<0){
          flags[11]=true; f=true
      }
      //yacht
      if(this.scores[12]<0){
          let hasYacht=true;
          for(let i=0; i<diceRoll.length; i++){
            if(diceRoll[i] != diceRoll[0]){
                hasYacht=false;
                break;
            }
          }
          if(hasYacht){
              flags[12]=true; f=true
          }
      }
      if(f)return flags;
      return null;
    },
    //ported from Java version
    calculateRollOptionNumeric: function(number,diceRoll){
      //check if rolls contains at least 1 instance of number
      for(let i=0; i<diceRoll.length; i++){
        if(diceRoll[i]===number){
            return true;
        }
      }
      return false;
    },
    //ported from Java version. computes the score of a given category and dice rolls
    calculateRollScore: function(category,dice){
        var score=0
        switch(category){ //like categories combined, unlike Java version
            case 0: //ones
            case 1: //twos
            case 2: //threes
            case 3: //fours
            case 4: //fives
            case 5: //sixes. sum of all matching dice
                score=this.calculateNumericScore(category+1,dice,false);break
            case 7: //full house, choice. sum of all dice
            case 11:
                dice.forEach(d=>{
                    score+=d
                });break
            case 8: //four-of-a-kind
                //since the roll was sorted earlier, either the odd one out is first or last in array
                if(dice[0]===dice[1] || dice[0]===dice[2]){
                    //last element is odd one out, first element is the matching pair
                    score=this.calculateNumericScore(dice[0],dice,true)
                }else{
                    //1st element is odd one out, second element is the matching pair
                    score=this.calculateNumericScore(dice[1],dice,true)
                }break;
            default://static scores already set, return -2 as error code
                score=-2; break
        }
        return score
    },
    //ported from Java version. helper method to reduce repetition, also overloaded with extra flag
    calculateNumericScore: function(number,dice,flag_4oak){
        let score=0; let count_4oak=0 //only count 4 matching numbers in 4 of a kind, edge case
        for(let i=0; i<dice.length; i++){
            if(dice[i]===number){
                score+=dice[i];
                //only count 4 matching copies, this is for edge case of a yacht (5 matching)
                if(flag_4oak && ++count_4oak==4)break;
            }
        }
        return score;
    }
  },
  //TODO: change css tags
  template: '<div id=diceComponentSub>\
            <label>Choice <strong>{{choice}}</strong></label>\
            <select v-model="choice">\
              <option disabled value="">Please select a category</option>\
              <option v-for="category in possibleCategories" v-bind:value="category">{{category.name}} ({{category.score}})</option>\
            </select>\
            <button v-on:click="confirmScore" :disabled="!choice">Confirm Score</button>\
            </div>'
})

//simply displays the player's score during the game, actual score is calculated in dice component
Vue.component('scoreboard',{
  data: function(){
    return{
      scores: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    }
  },
  methods: {
    updateScores: function(newScores){
      this.scores = [...newScores]
    }
  },
  template: '<div id=score>\
            <h1>Score</h1>\
            <table>\
              <tr><th>Category</th><th>Score</th></tr>\
              <tr class=ones><td>Ones</td><td>{{scores[0]}}</td></tr>\
              <tr class=twos><td>Twos</td><td>{{scores[1]}}</td></tr>\
              <tr class=threes><td>Threes</td><td>{{scores[2]}}</td></tr>\
              <tr class=fours><td>Fours</td><td>{{scores[3]}}</td></tr>\
              <tr class=fives><td>Fives</td><td>{{scores[4]}}</td></tr>\
              <tr class=sixes><td>Sixes</td><td>{{scores[5]}}</td></tr>\
              <tr class=bonus><td>Bonus</td><td>{{scores[6]}}</td></tr>\
              <tr class=fullHouse><td>Full House</td><td>{{scores[7]}}</td></tr>\
              <tr class=fourKind><td>Four-of-a-Kind</td><td>{{scores[8]}}</td></tr>\
              <tr class=littleStraight><td>Little Straight</td><td>{{scores[9]}}</td></tr>\
              <tr class=bigStraight><td>Big Straight</td><td>{{scores[10]}}</td></tr>\
              <tr class=choice><td>Choice</td><td>{{scores[11]}}</td></tr>\
              <tr class=yacht><td>Yacht</td><td>{{scores[12]}}</td></tr>\
            </table>\
            </div>'
})

//game results component
Vue.component('game-results',{
  template: '<div>\
            <p>GAME OVER...</p>\
            <button v-on:click=\"$emit(\'restart-game\',true)\">Save Game</button>\
            <button v-on:click=\"$emit(\'restart-game\',false)\">Do Not Game</button>\
            </div>'
})

var game = new Vue({
  el: '#game',
  data: {
    gameState: 0, //0 is welcome, 1 is main, 2 is results
    roundNumber: 0, //keeps track of scoring rounds range(1,12, reset to 0 on game over)
    rollNumber: 0, //keeps track of rolls range(1,3 only 0 before first roll of game)
    rollValues: [], //values for the round's final roll
    scores: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  },
  computed: {
    gameComponent: function(){
      switch(this.gameState){
        case 1: return 'game-main'
        case 2: return 'game-results'
        default: return 'game-welcome'
      }
    }
  },
  watch: {
    roundNumber: function(){
      if(this.roundNumber > 12){ //roundNumber will be 13 when the game ends
        console.log("Round limit exceeded, ending game")
        this.roundNumber=0
        this.gameEnd()
      }
    },
    rollNumber: function(){
      if(this.rollNumber > 3){
        this.rollNumber=1
        this.roundNumber++
      }
    }
  },
  methods: {
    startGame: function(){
      //instantiate variables and other setup
      console.log("starting game...")
      this.mainEngine()

    },
    mainEngine: async function(){
      //main game loop, use Vue components for dice and i/o operations
      console.log("beginning game loop...")
      this.gameState=1
      this.roundNumber=1
    },
    gameEnd: function(){
      //ask if user wants to save game
      console.log("game finished")
      this.gameState = 2

    },
    saveGame: function(flag){
      //show Vue component with input form, ask for confirmation before accepting
      //write to DynamoDB
      if(flag){
        console.log("saving game to database...")
      }else{
        console.log("game was not saved")
      }
      this.gameState = 0
    },
    toggleRules: function(){
      this.showRules = !this.showRules
    },
    rolled: function(){
      this.rollNumber++
    },
    scoreConfirmed: function(score){
      console.log("main, score confirmed: "+score.score+" for category "+score.code)

    }
  },
  beforeMount(){
    console.log("Vue script loaded")
  }
})


//from official JS documentation
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//click handler for displaying game rules, toggles visibillity and icon
function toggleRules(){
  if(document.getElementById("rulesArea").style.display === ""){
    document.getElementById("rulesArea").style.display = "block"
    document.getElementById("rulesHeaderIcon").className = "fas fa-caret-up"
  }else{
    document.getElementById("rulesArea").style.display = ""
    document.getElementById("rulesHeaderIcon").className = "fas fa-caret-down"
  }
}
