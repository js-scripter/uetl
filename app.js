const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const appRoot = require("app-root-path");
const path = require('path');
const scheduler =require('./scheduler')
const port = process.env.PORT || 3000
const app = express()

// cron job to run asynchronously, non blobking way, every 1 minute 
// to check for new file and upload it to the DB
scheduler.scheduleETL();

app.get("/", (request, response) => {
        let pathUri = `${appRoot}/client/home.html`;
        response.sendFile(path.resolve(pathUri));
    }
)

app.post('/uploadBooks', upload.single('books'), (req, res, next)=> {
  // req.file is the `books` file
  // req.body will hold the text fields, if there were any
  console.log(req.file)
  // after upload is complete send user a upload status view 
  let pathUri = `${appRoot}/client/uploadStatus.html`;
  res.sendFile(path.resolve(pathUri));
})


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})