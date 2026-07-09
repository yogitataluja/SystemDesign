const express = require('express');
const { createServer } = require('node:http');
const bodyParser = require('body-parser');
const path = require('node:path');
const { Server } = require('socket.io');
app.use(bodyParser.json());
//webhook server
app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log('Received webhook payload:', payload);
  //verify the authenticity of the webhook request if needed by 
  // Here you can process the payload and perform any necessary actions like updating a database, sending notifications, etc.


  res.status(200).send('Webhook received successfully');
})






// This makes the app run and available in the browser.
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


  

