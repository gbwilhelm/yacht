const express = require("express")
const bodyParser = require("body-parser")
const { DynamoDBClient, DescribeTableCommand } = require("@aws-sdk/client-dynamodb")

//Define AWS functions here

const ddbClient = new DynamoDBClient({region:"us-east-1"})

const describeTable = function(){
  const params = {TableName:"yacht-scores"};

  console.log("request sent...")

  const run = async () => {
    try {
      const data = await ddbClient.send(new DescribeTableCommand(params))
      console.log("Success",data.Table.KeySchema)
      return data
    } catch (err) {
      console.log("Error",err)
    }
  }; run()
}

//define REST API calls here

const app = express()
app.use(bodyParser.json());
app.use(express.static("public"))

app.route("/ddb")
  .get(function(req,res){
    describeTable()
    //send table data to client
    res.send("Hello world from /ddb!!!")
  })
  .post(function(req,res){
    console.log(req.body.title)
    //write to database, then send status code only
    res.send("POST received")
  })

app.listen(8080) //run server, access via ip:port
console.log("server listening on port 8080")
