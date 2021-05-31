const express = require("express")
const bodyParser = require("body-parser")
const md5 = require("md5")
const aws = require("aws-sdk")
const https = require("https")
const fs = require("fs")

const VERBOSE = false //toggles logging

aws.config.update({region: 'us-east-1'});
const ddb = new aws.DynamoDB({apiVersion: '2012-08-10'});

const fetchLeaderboard = async function(){
  if(VERBOSE)console.log("sending query...")
  //Access Global Secondary index with Key (version,total)
  const params = {TableName:"project-yacht",IndexName:"version-total-index",
                  Limit:"10",KeyConditionExpression:"#v = :v",ScanIndexForward:false,
                  ExpressionAttributeNames:{"#v":"version"},ExpressionAttributeValues:{":v":{S:"web"}}}
  const run = async () => {
    try{
      let data = await ddb.query(params).promise()
      if(VERBOSE)console.log("query success")
      return data['Items']
    }catch(err){
      throw err
    }
  }
  res = await run()
  return res
}

const writeTable = async function(data){
  if(VERBOSE)console.log("preparing to write to database...")
  //all numeric data fields must be strings
  //Primary key is MD5 hash of entire data object string
  const params = {TableName: 'project-yacht',
                  Item:{'key':{B:md5(JSON.stringify(data))},'version':{S:'web'},'title':{S:data.title},'name':{S:data.name},'total':{N:data.total.toString()},
                    'ones':{N:data.scores[0].toString()},'twos':{N:data.scores[1].toString()},'threes':{N:data.scores[2].toString()},
                    'fours':{N:data.scores[3].toString()},'fives':{N:data.scores[4].toString()},'sixes':{N:data.scores[5].toString()},
                    'bonus':{N:data.scores[6].toString()},'full_house':{N:data.scores[7].toString()},'four_kind':{N:data.scores[8].toString()},
                    'little_s':{N:data.scores[9].toString()},'big_s':{N:data.scores[10].toString()},'choice':{N:data.scores[11].toString()},
                    'yacht':{N:data.scores[12].toString()},'comment':{S:data.comment},'public':{BOOL:data.public}}}
  const run = async () => {
    try {
      let data = await ddb.putItem(params).promise()
      if(VERBOSE)console.log("put success")
      return data
    }catch(err){
      throw err
    }
  }
  res = await run()
  return res
}

//define REST API calls here

const app = express()
app.use(bodyParser.json());
app.use(express.static("public"))

app.route("/ddb")
  .get(async function(req,res){
    if(VERBOSE)console.log("GET request received")
    try{
      responseData = await fetchLeaderboard()
      if(VERBOSE)console.log("Scan Result:\n",responseData)
      //send table data to client
      res.status(200).send(responseData)
    }catch(e){
      if(VERBOSE)console.log("sending error to client\n",e)
      res.status(500).send("error:\n"+e)
    }
  })
  .post(async function(req,res){
    if(VERBOSE)console.log("POST request received, body:\n",req.body)
    try{
      //write to database, then send status code only
      responseData = await writeTable(req.body)
      if(VERBOSE)console.log("sending 200 back to client")
      res.sendStatus(200)
    }catch(e){
      if(VERBOSE)console.log("sending error to client\n",e)
      res.status(500).send("error:\n"+e)
    }
  })

https.createServer({key:fs.readFileSync("cert/server.key"),cert:fs.readFileSync("cert/server.cert")},app).listen(8080)
console.log("https server listening on port 8080")
app.listen(8081)
console.log("http server listening on port 8081")
