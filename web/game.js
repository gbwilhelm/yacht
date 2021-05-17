//default component in game area
Vue.component('game-welcome',{
  template: '<button v-on:click="$emit(\'start-game\')">Start Game</button>'
})

//game loop component
Vue.component('game-main',{
  template: '<div>\
            <p>MAIN GAME LOOP... (5 seconds)</p>\
            <img src="img/dice_6.png" width=100 height=100>\
            </div>'
})

//game results component
Vue.component('game-results',{
  template: '<p>GAME OVER... (4 seconds)</p>'
})

var game = new Vue({
  el: '#game',
  data: {
    gameState: 0 /*0 is welcome, 1 is main, 2 is results*/
  },
  computed: {
    gameComponent: function(){
      switch(this.gameState){
        case 1: return 'game-main';
        case 2: return 'game-results';
        default: return 'game-welcome';
      }
    }
  },
  watch: {

  },
  methods: {
    startGame: function(){
      //instantiate variables and other setup
      console.log("starting game...")
      this.mainEngine()

    },
    mainEngine: function(){
      //main game loop, use Vue components for dice and i/o operations
      console.log("beginning game loop...")
      this.gameState = 1;
      setTimeout(() => { this.gameEnd() }, 5000);

    },
    gameEnd: function(){
      //ask if user wants to save game
      console.log("game finished")
      this.gameState = 2;
      setTimeout(() => { this.saveGame() }, 4000);

    },
    saveGame: function(){
      //show Vue component with input form, ask for confirmation before accepting
      //write to DynamoDB
      console.log("saving game to database...")
      this.gameState = 0;
    }
  },
  beforeMount(){
    console.log("Vue script loaded")
    //create button component to start game
    this.gameState = 0;
  }
})
