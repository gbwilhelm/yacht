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
      xmlHttp.send()
      return xmlHttp
    }
  },
  mounted(){
    this.fetchData()
  }
})
