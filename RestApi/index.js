// const express=require('express');// recommended way to import express theres is another way also using import
import express from 'express';// this is the way to import express using es6 module syntax but to support that type of i have to type:module in package.json file
import bodyParser from 'body-parser';
const app=express(); // by this we are creating an instance of express and storing it in app variable
const port=3000; // this is the port number on which our server will run
app.listen(port,()=>console.log(`server is running on port ${port}`)); // this is the code to start the server and listen on the specified port also we are passing a callback function that will be executed when the server starts successfully
app.use(bodyParser.json()); // this is a middleware that will parse the incoming request body and make it available in req.body
let todos=[{
      id: 1,
      todo: "Do something nice for someone you care about",
      completed: false,
      userId: 152
    },
    {
      id: 2,
      todo: "Memorize a poem",
      completed: true,
      userId: 13
    },]
app.get("/todos",(request,response)=>{
    console.log("request received", request, response);
    response.json(todos);
    
}) 
app.post("/todos",(request,response)=>{
  let data=request.body
todos.push(data);
  response.send("post request received");
  response.json({message:"post request received",data:todos});
  }
  )

app.put("/todo/:id", (req, resp)=>{
  const id = req.params.id;
  const body=req.body
  const findIndex=todos.findIndex(todo=> todo.id==id)
  if(findIndex>-1){todos[findIndex]={...body, id:id}}
  else{
    resp.status(404).json({message:"todo not found"}) 
  }
  // todos.forEach((todo, index) => {
  //   if (todo.id == id) {
  //     todos[index] = { ...todo, ...body };
  //   }
  //   return todo
  // });
  resp.json({ message: "put request received", data: todos });
})
app.delete("/todo/:id", (req, resp)=>{
  const id = req.params.id;
  const findIndex=todos.findIndex(todo=> todo.id==id)
  if(findIndex>-1){todos.splice(findIndex,1)}
  else{
    resp.status(404).json({message:"todo not found"}) 
  }
  resp.json({ message: "delete request received", data: todos });
})
app.all("/",(request,response)=>{
  console.log("request received", request, response);
    response.send("welcome to my server");
    
})
