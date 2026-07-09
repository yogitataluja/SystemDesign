const express = require("express");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader(
        'Content-Security-Policy',
        "default-src 'self';" + 
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;" +
        "script-src 'self' 'nonce-randomKey' http://unsecure.com;" +// allow scripts from self, allow inline scripts, allow scripts from unsecure.com
        "img-src 'self' data: https://images.pexels.com/" // allow images from self, allow data URIs, allow images from images.com
      );
    next();
})
app.use(express.static("public"));// all my static files are in public folder
// app.get("/", (req,res)=>{
//     res.sendFile(__dirname + "/public/index.html");
//   })

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
  }) // after give use no need to give the folder name public because we have already given the static folder name as public
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});