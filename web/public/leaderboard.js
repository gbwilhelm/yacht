//require() does not work here, need to figure out import syntax
//import { DescribeTableCommand } from "../@aws-sdk/client-dynamodb"

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

  },
  /*beforeMount(){
    console.log("creating ddb client...")
    this.ddbClient = new DynamoDBClient({region:"us-east-1"})
  },
  mounted(){
    // Set the parameters
    const params = { TableName: "yacht-scores" }; //TABLE_NAME

    console.log("request sent...")

    const run = async () => {
      try {
        const data = await this.ddbClient.send(new DescribeTableCommand(params));
        window.alert("Success\n"+data.Table.KeySchema);
        return data;
      } catch (err) {
        window.alert("Error\n"+err);
      }
    };
    run();
  }*/
})
