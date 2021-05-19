const express = require("express")
const { DynamoDBClient, DescribeTableCommand } = require("@aws-sdk/client-dynamodb")

const app = express()
app.use(express.static("public"))

app.listen(8080) //run server, access via ip:port
console.log("server listening on port 8080")

const initClient = function(){
  console.log("creating ddb client...")
  this.ddbClient = new DynamoDBClient({region:"us-east-1"})
}

const describeTable = function(){
  const params = {TableName:"yacht-scores"};

  console.log("request sent...")

  const run = async () => {
    try {
      const data = await this.ddbClient.send(new DescribeTableCommand(params))
      console.log("Success",data.Table.KeySchema)
      return data
    } catch (err) {
      console.log("Error",err)
    }
  }; run()
}

//need to use express routing to relay info between client and server
//server will interface with Database, then pipe results back to client

//initClient(); describeTable();
