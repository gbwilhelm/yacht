const express = require("express")
const { DynamoDBClient, DescribeTableCommand } = require("@aws-sdk/client-dynamodb")

const app = express()
app.use(express.static("public"))

app.listen(8080) //run server, access via ip:port
console.log("server listening on port 8080")
