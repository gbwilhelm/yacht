var app = new Vue({
  el: '#leaderboard',
  data: {
    //user must refresh the page to fetch any updates to leaderboard
    entries: [],
    currentEntry: -1
  },
  methods: {
    fetchData: async function(data){
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET","/ddb",false)
      xmlHttp.send() //blocking send
      return xmlHttp
    },
    radioClick: function(index){
      this.currentEntry = index
    }
  },
  mounted(){
    //only fetch from databse once, when app has finished loading
    this.$nextTick(async function () {
      let response = await this.fetchData()
      if(response.status!=200){
        window.alert("Request failed with HTTP status code "+response.status)
      }else{
        this.entries = [...JSON.parse(response.response)]
      }
    })
  }
})
