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
      //run calculations on possible scores
    },
    scoreConfirmed: function(score,category){
      this.mainState = 0
      this.$emit("score-confirmed",score,category)
      //start next roll after emit is done
      console.log("main evoking rollDice()")
      this.$refs.dice.rollDice()
    }
  },
  template: '<div>\
            <p>MAIN GAME LOOP...</p>\
            <p>mainState: {{mainState}}</p>\
            <dice ref="dice" v-on:rolled="rolled" v-on:begin-scoring="beginScoring" v-on:score-confirmed="scoreConfirmed"></dice>\
            <scoreboard ref="scoreboard"></scoreboard>\
            </div>'
})

//component displays dice roll, also shows scoring categories, signals sent to game-main component
//TODO: move logic for calculating scores into a separate component
Vue.component('dice',{
  data: function(){
    return{
      diceRoll: [1,1,1,1,1],
      diceChosen: [false,false,false,false,false],
      diceLocked: [false,false,false,false,false],
      imgPaths: ["img/dice_1.png","img/dice_1.png","img/dice_1.png","img/dice_1.png","img/dice_1.png"],
      imgIndex: 9, //index in imgPaths of the image number
      possibleCategories: [], //available scoring categories
      allCategories: [{name:'Ones',code:0,score:0},{name:'Twos',code:1,score:0},{name:'Threes',code:2,score:0}, //all categories
                      {name:'Fours',code:3,score:0},{name:'Fives',code:4,score:0},{name:'Sixes',code:5,score:0},
                      {name:'Full House',code:7,score:0},{name:'Four-of-a-Kind',code:8,score:0},{name:'Little Straight',code:9,score:0},
                      {name:'Big Straight',code:10,score:0},{name:'Choice',code:11,score:0},{name:'Yacht',code:12,score:0}],
      choice: "", //selected category
      scores: [] //player's score array
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
    },
    confirmScore: function(){
      this.$emit("score-confirmed",this.choice)
      this.choice=""
    },
    //ported from Java version
    calculateRollOptions: function(){
      var flags = new boolean[13]
      var f=false
      //ones through sixes
      for(let int i=0; i<6; i++){
          if(this.scores[i]<0){
              if(this.calculateRollOptionNumeric(i+1)){
                  flags[i]=true;f=true
              }
          }
      }
      //full house
      if(this.scores[7]<0){
          let first=-1; let firstCount=0
          let second=-1; let secondCount=0
          for(let d:this.diceRoll){
              if(d === first){
                  firstCount++
              }else if(d===second){
                  secondCount++
              }else if(first===-1){
                  first=d; firstCount++
              }else{
                  if(second===-1 && d!=first){
                      second=d; secondCount++
                  }else{
                      if(d != first && d != second){ //third number detected
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
          if(dice[0]===this.diceRoll[1]){
              primary = this.diceRoll[0]
          }if(dice[0]===this.diceRoll[2]){
              primary = this.diceRoll[0]
          }else if(dice[1] === this.diceRoll[2]){
              primary = this.diceRoll[1]
          }else{
              primary = -1 //first 3 dice are unique, thus no four-of-a-kind
          }

          if(primary!=-1){
              let b1=false//flag for first mismatch
              let b2=false//flag for second mismatch
              for(let d:dice){
                  if(d!=primary){
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
      this.diceRoll.sort((a,b) => a-b)
      //little straight
      if(this.scores[9]<0){
          if(this.diceRoll[0]===1 && this.diceRoll[1]===2 && this.diceRoll[2]===3
              && this.diceRoll[3]===4 && this.diceRoll[4]===5){
                  flags[9]=true; f=true
              }
      }
      //big straight
      if(this.scores[10]<0){
          if(this.diceRoll[0]===2 && this.diceRoll[1]===3 && this.diceRoll[2]===4
              && this.diceRoll[3]===5 && this.diceRoll[4]===6){
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
          for(let d:this.diceRoll){
              if(d != this.diceRoll[0]){
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
    calculateRollOptionNumeric: function(number){
      for(let d:this.diceRoll){
          if(d===number){
              return true;
          }
      }
      return false;
    }
  },
  template: '<div id=diceComponent>\
            <p>Your Roll</p>\
            <p v-if="this.$parent.mainState===0">Choose which dice you want to keep, the rest will be rerolled.</p>\
            <p v-if="this.$parent.mainState===1">Choose which category you want to score in.</p>\
            <div id=diceImageContainer>\
              <figure id=dice0 class=dice><img v-bind:src=imgPaths[0] width=100 height=100 v-on:click="toggleDice(0)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
              <figure id=dice1 class=dice><img v-bind:src=imgPaths[1] width=100 height=100 v-on:click="toggleDice(1)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
              <figure id=dice2 class=dice><img v-bind:src=imgPaths[2] width=100 height=100 v-on:click="toggleDice(2)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
              <figure id=dice3 class=dice><img v-bind:src=imgPaths[3] width=100 height=100 v-on:click="toggleDice(3)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
              <figure id=dice4 class=dice><img v-bind:src=imgPaths[4] width=100 height=100 v-on:click="toggleDice(4)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
            </div>\
            <div id=diceComponentSub v-if="this.$parent.mainState===0"><button v-on:click="confirmRoll">Confirm Roll</button></div>\
            <div id=diceComponentSub v-if="this.$parent.mainState===1">\
              <label>Chose <strong>{{choice}}</strong></label>\
              <select v-model="choice">\
                <option disabled value="">Please select a category</option>\
                <option v-for="category in possibleCategories" v-bind:value="category">{{category.name}} ({{category.score}})</option>\
              </select>\
              <button v-on:click="confirmScore" :disabled="!choice">Confirm Score</button>\
            </div>\
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
