//demo from Vue official website
Vue.component('button-counter',{
  data: function(){
    return {
      count: 0,
      flag: false
    }
  },
  template: '<button v-on:click="count++,flag=!flag,$emit(\'changed-flag\',flag)">You clicked me {{count}} times.</button>'
})

//text box component
Vue.component('input-component',{
  data: function(){
    return{
      text: ''
    }
  },
  template: '<input v-on:input="text=$event.target.value,$emit(\'changed-text\',text)"></input>'
})

//Vue application
var app = new Vue({
  el: '#app',
  data: {
    message: '', //the message to be displayed
    message_input: '', //the text in the text box
    visib_flag: false, //radio button variable
    text_class: 'message_black', //class of text fields
    flag: false, //flag for component
    text: '' //input value
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
    },
    flag_handler: function(val){
      this.flag = val
    },
    input_handler: function(val){
      this.text = val
    },
    test_evoke: function(){
      console.log('function evoked')
    }
  },
  //called once when page is loaded
  beforeMount(){
    console.log("Vue script loaded")
  }
})

//called after beforeMount()
console.log("JavaScript loaded!")
//manually evoke Vue function
app.test_evoke()
