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
      console.log("response:",response.response)
      console.log("status:",response.status)
    })
  }
})
