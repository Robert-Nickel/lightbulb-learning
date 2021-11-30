// Listen to OpenQuestion SQS (https://sqs.eu-central-1.amazonaws.com/532688539985/InfrastructureStack-createopenquestionqueue9888C522-9DMN7ZSNO1UR.fifo)
// TODO: Listen to CreatedAnswer SQS..
// For every entry for every user count += 1

// Bei jeder Anfrage erhalten wir Tenant + UserID
/*
getUserStats(userid) -> {
    createdQuestions: 10,
    createdAnswers: 20
}
*/

const express = require('express')
const app = express()
const port = 3000

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
const QUEUE_URL = "https://sqs.eu-central-1.amazonaws.com/532688539985/Microservice-Assessment.fifo";
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

app.get('/get-userinfo', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ createdQuestions: 10, createdAnswers: 20 }));
})
app.listen(port);

var params = {
  AttributeNames: [
     "SentTimestamp"
  ],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
     "All"
  ],
  QueueUrl: QUEUE_URL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 10
 };
 
 sqs.receiveMessage(params, function(err, data) {
   if (err) {
     console.log("Receive Error", err);
   } else if (data.Messages) {
     console.log("data.Messages:")
     console.log(data.Messages);

     // get type of message (is it a question? is it an reviewed answer?)

     // get user info from DB

     // calculate new user info

     // store new user info in db

     var deleteParams = {
       QueueUrl: QUEUE_URL,
       ReceiptHandle: data.Messages[0].ReceiptHandle
     };
     sqs.deleteMessage(deleteParams, function(err, data) {
       if (err) {
         console.log("Delete Error", err);
       } else {
         console.log("Message Deleted", data);
       }
     });
   }
 });

