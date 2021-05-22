const express = require("express")
const bodyParser = require("body-parser")
const md5 = require("md5")
const aws = require("aws-sdk")

//Define AWS functions here

//const ddbClient = new DynamoDBClient({region:"us-east-1"})
aws.config.update({region: 'us-east-1'});
const ddbClient = new aws.DynamoDB({apiVersion: '2012-08-10'});

const describeTable = async function(){
  const params = {TableName:"yacht-scores"};
  const run = async () => {
    try {
      const data = await ddbClient.send(new DescribeTableCommand(params))
      return data
    } catch (err) {
      console.log("Error",err)
      return err
    }
  };
  res = await run()
  return res
}

const writeTable = async function(data){
  console.log("preparing to write to database...")
  //all data fields must be strings
  const params = {TableName: 'yacht-scores',
                  Item:{'key':{B:md5(data.title+data.name+data.total).toString()},'title':{S:data.title},'name':{S:data.name},'total':{N:data.total.toString()},
                    'ones':{N:data.scores[0].toString()},'twos':{N:data.scores[1].toString()},'threes':{N:data.scores[2].toString()},
                    'fours':{N:data.scores[3].toString()},'fives':{N:data.scores[4].toString()},'sixes':{N:data.scores[5].toString()},
                    'bonus':{N:data.scores[6].toString()},'full_house':{N:data.scores[7].toString()},'four_kind':{N:data.scores[8].toString()},
                    'little_s':{N:data.scores[9].toString()},'big_s':{N:data.scores[10].toString()},'choice':{N:data.scores[11].toString()},
                    'yacht':{N:data.scores[12].toString()},'comment':{S:data.comment},'public':{B:data.public.toString()}}}
  const run = async () => {
    try {
      ddbClient.putItem(params, function(err2, data2) {
        console.log("write operation finished")
        if (err2) {
          console.log("Write Error:",err2)
          throw err2
        } else {
          console.log("write success")
          return data2
        }
      });
    } catch (err) {
      console.log("Error",err)
      throw err
    }
  };
  res = await run()
  return res
}

//define REST API calls here

const app = express()
app.use(bodyParser.json());
app.use(express.static("public"))

app.route("/ddb")
  .get(async function(req,res){
    console.log("GET request received")
    try{
      responseData = await describeTable()
      console.log("Table info",responseData.Table.KeySchema)
      //send table data to client
      res.status(200).send("Hello world from /ddb!!!")
    }catch(e){
      res.status(500).send("error:\n"+e)
    }
  })
  .post(async function(req,res){
    console.log("POST request received, body:\n",req.body)
    try{
      //write to database, then send status code only
      responseData = await writeTable(req.body)
      console.log("sending 200 back to client")
      res.sendStatus(200)
    }catch(e){
      console.log("sending error to client\n",e)
      res.status(500).send("error:\n"+e)
    }
  })

app.listen(8080) //run server, access via ip:port
console.log("server listening on port 8080")
