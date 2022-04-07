const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const appRoot = require("app-root-path");
const path = require('path');
const port = process.env.PORT || 3000
const scheduler =require('./scheduler')

const app = express()

// cron job to run every 1 minute to check for new file and upload it to the DB
scheduler.scheduleUpload();

app.get("/", (request, response) => {
        let pathUri = `${appRoot}/client/home.html`;
        response.sendFile(path.resolve(pathUri));
    }
)

app.post('/uploadBooks', upload.single('books'), (req, res, next)=> {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file)
  let pathUri = `${appRoot}/client/uploadStatus.html`;
  response.sendFile(path.resolve(pathUri));
})


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})