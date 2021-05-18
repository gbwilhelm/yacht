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
  methods:{
    rollConfirmed(roll){
      this.$emit("roll-confirmed",roll)
    }
  },
  template: '<div>\
            <p>MAIN GAME LOOP...</p>\
            <dice v-on:roll-confirmed="rollConfirmed"></dice>\
            </div>'
})

//need to add constructor to this component which passes the roll and locked arrays
Vue.component('dice',{
  data: function(){
    return{
      path: 'img/dice_',
      pathEnd: '.png',
      diceRoll: [1,2,3,4,5],
      diceChosen: [false,false,false,false,false],
      diceLocked: [false,false,false,false,false]
    }
  },
  computed: {
      d0: function(){
        return this.path+this.diceRoll[0]+this.pathEnd
      },
      d1: function(){
        return this.path+this.diceRoll[1]+this.pathEnd
      },
      d2: function(){
        return this.path+this.diceRoll[2]+this.pathEnd
      },
      d3: function(){
        return this.path+this.diceRoll[3]+this.pathEnd
      },
      d4: function(){
        return this.path+this.diceRoll[4]+this.pathEnd
      }
  },
  methods: {
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
      //pass rolls up to parent if the round is over, else pass empty array
      if(this.$parent.$parent.rollNumber===3){
        this.$emit("roll-confirmed",this.diceRoll)
      }else{
        this.$emit("roll-confirmed",[])
      }
    }
  },
  template: '<div id=diceComponent>\
            <p>Your Roll</p>\
            <p>Choose which dice you want to keep, the rest will be rerolled.</p>\
            <div id=diceImageContainer>\
            <figure id=dice0 class=dice><img v-bind:src="d0" width=100 height=100 v-on:click="toggleDice(0)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
            <figure id=dice1 class=dice><img v-bind:src="d1" width=100 height=100 v-on:click="toggleDice(1)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
            <figure id=dice2 class=dice><img v-bind:src="d2" width=100 height=100 v-on:click="toggleDice(2)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
            <figure id=dice3 class=dice><img v-bind:src="d3" width=100 height=100 v-on:click="toggleDice(3)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
            <figure id=dice4 class=dice><img v-bind:src="d4" width=100 height=100 v-on:click="toggleDice(4)"><figcaption><i class="fas fa-lock-open"></i></figcaption></figure>\
            </div>\
            <div id=diceComponentSub><button v-on:click=\"confirmRoll\">Confirm Roll</button></div>\
            </div>'
})

//<i class="fas fa-lock"></i>
//<i class="fas fa-unlock"></i>console.log(
//<i class="fas fa-lock-open"></i>

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
    rollNumber: 1, //keeps track of rolls range(1,3)
    rollValues: [] //values for the round's final roll
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
      if(this.rollNumber > 3){ //rollNumber will be 4 when the round ends
        this.rollNumber=1
        console.log('final roll: '+this.rollValues)
        //todo: begin scoring event
        this.roundNumber++ //will update after player has scored
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
    rollConfirmed: function(roll){
      this.rollNumber++
      this.rollValues=roll
    }
  },
  beforeMount(){
    console.log("Vue script loaded")
  }
})

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
