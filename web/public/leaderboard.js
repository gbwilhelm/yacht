var app = new Vue({
  el: '#leaderboard',
  data: {
    entries: []
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
    this.$nextTick(async function () {
      let response = await this.fetchData()
      this.entries = [...JSON.parse(response.response)]
    })
  }
})
