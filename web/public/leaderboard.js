var app = new Vue({
  el: '#leaderboard',
  data: {
    //test data to avoid pinging database
    entries: [{name:{S:'testName10'},title:{S:'testTitle10'},total:{N:10},comment:{S:'testComment10'},public:{BOOL:true}},
              {name:{S:'privateCommentTest'},title:{S:'testTitle7'},total:{N:7},comment:{S:''},public:{BOOL:false}},
              {name:{S:'webTest5'},title:{S:'testTitle5'},total:{N:5},comment:{S:''},public:{BOOL:false}},
              {name:{S:'newLambdaTest'},title:{S:'testTitle4'},total:{N:4},comment:{S:''},public:{BOOL:false}},
              {name:{S:'testName3'},title:{S:'testTitle3'},total:{N:3},comment:{S:''},public:{BOOL:true}},
              {name:{S:'Max Width Test'},title:{S:'This title has the max charact'},total:{N:1},comment:{S:'This comment has the max limit of 300 characters. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},public:{BOOL:true}}]
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
    //only fetch from databse once, when app has finished loading
    /*this.$nextTick(async function () {
      let response = await this.fetchData()
      this.entries = [...JSON.parse(response.response)]
    })*/
  }
})
