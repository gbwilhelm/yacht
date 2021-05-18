//default component in game area
Vue.component('game-welcome',{
  template: '<div>\
            <h1>Welcome to Yacht!</h1>\
            <p>When ready, click \"Start Game\"<br>\
            To review the rules at any time, click \"Rules\" at the top-right of the page.</p>\
            <button v-on:click=\"$emit(\'start-game\')\">Start Game</button>\
            </div>'
})

//game loop component
Vue.component('game-main',{
  template: '<div>\
            <p>MAIN GAME LOOP...</p>\
            <img src=\"img/dice_6.png\" width=100 height=100>\
            <button v-on:click=\"$emit(\'end-game\')\">End Game</button>\
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
    showRules: false //toggles display of game rules
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

    },
    gameEnd: function(){
      //ask if user wants to save game
      console.log("game finished")
      this.gameState = 2;

    },
    saveGame: function(flag){
      //show Vue component with input form, ask for confirmation before accepting
      //write to DynamoDB
      if(flag){
        console.log("saving game to database...")
      }else{
        console.log("game was not saved")
      }
      this.gameState = 0;
    },
    toggleRules: function(){
      this.showRules = !this.showRules
    }
  },
  beforeMount(){
    console.log("Vue script loaded")
    //create button component to start game
    this.gameState = 0;
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
