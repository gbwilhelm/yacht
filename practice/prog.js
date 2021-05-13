var app = new Vue({
  el: '#app',
  data: {
    message: '', //the message to be displayed
    message_input: '', //the text in the text box
    visib_flag: false, //radio button variable
    text_class: 'message_black' //class of text fields
  },
  //computed executes function when rendering variable
  computed: {
    //convert message to all caps
    message_caps: function(){
      return this.message.toUpperCase()
    }
  },
  //watch executes function when the variable changes
  watch: {
    //change message when message_input(text box) changes
    message_input: function(){
      this.message = this.message_input
    }
  },
  methods: {
    //button click handler
    to_red: function(event){
      this.text_class = 'message_red'
    },
    to_black: function(event){
      this.text_class = 'message_black'
    }
  }
})

//regular JavaScript executed when file is loaded
console.log("script loaded!")
