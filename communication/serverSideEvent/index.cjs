const express=require('express');// recommended way to import express theres is another way also using import
// import express from 'express';// this is the way to import express using es6 module syntax but to support that type of i have to type:module in package.json file
const app=express(); // by this we are creating an instance of express and storing it in app variable
const path = require('node:path');
const port=3000; // this is the port number on which our server will run

app.get("/",(request,response)=>{
  response.sendFile(path.join(__dirname, 'index.html'))
})



app.get("/getData", (request, res)=>{
 res.setHeader('Content-Type','text/event-stream')
 res.setHeader('Connection', 'keep-alive')
 res.setHeader('Cache-Control', 'no-cache')
 // logic of data is going to be here : Database call 
res.write("data: hello server -sent event\n\n")
 // after 5 seconds it will send random number 
 const intervalId= setInterval(()=>{res.write(`data: some random number :${Math.floor(Math.random()*100)}\n\n`)},1000)
 //
  
  request.on('close', () => {
  console.log('Client disconnected');
  clearInterval(intervalId);
  res.end();
 });

})

app.listen(port,()=>console.log(`server is running on port ${port}`));  
