var app = new Vue({
  el: '#leaderboard',
  data: {
    ddbClient: '',
    flag: false
  },
  computed: {

  },
  watch: {

  },
  methods: {
    fetchData: async function(data){
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET","/ddb",false)
      xmlHttp.send() //blocking send
      return xmlHttp
    }
  },
  mounted(){
    //nextTick ensures child components have loaded
    this.$nextTick(async function () {
      let response = await this.fetchData()
      let body = JSON.parse(response.response)
      console.log("response:",body)
      //TODO: run more tests to ensure the indexed scan returned the top scores
      for(let i=0; i<body.length; i++){
        console.log("Player: "+body[i].name.S+"\tTotal:"+body[i].total.N)
      }
    })
  }
})
