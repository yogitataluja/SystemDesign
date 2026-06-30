const express=require('express');// recommended way to import express theres is another way also using import
// import express from 'express';// this is the way to import express using es6 module syntax but to support that type of i have to type:module in package.json file
const app=express(); // by this we are creating an instance of express and storing it in app variable
const path = require('path');
const port=3000; // this is the port number on which our server will run
app.listen(port,()=>console.log(`server is running on port ${port}`));  
app.get("/",(request,response)=>{
  response.sendFile(path.join(__dirname, 'index.html'))
})
// app.all("/",(request,response)=>{
//    console.log("request received", request, response);
//     response.send("welcome to my server");
   
// })
let data="Data from Sql"
let waitingClientResponse=[]
//waitlist created to handle which client give which responnd
app.get("/getData", (request, response)=>{
  if(data!== request.query.lastData){
response.send({data}) //untill i did not explicity send something request is on hold
  }else{
waitingClientResponse.push(response)
  }
  
  
})

// app.get("/updatedData", (request, response)=>{
//   response.send("updated data")
// })
// here i handle to send back user with updated data
app.get("/updatedData", (request, response)=>{
  data=request.query.data
while(waitingClientResponse.length>0){waitingClientResponse.pop().send({data})}
  response.send({success:"Data updated"})

})