const express = require('express')
const multer  = require('multer')
const appRoot = require("app-root-path");
const path = require('path');
const pool = require('./db.js')
const scheduler =require('./scheduler')
const port = process.env.PORT || 3000
const app = express()
app.use(express.static(path.join(__dirname, 'client')));      // serving static files

// cron job to run asynchronously, non blobking way, every 1 minute 
// to check for new file and upload it to the DB
scheduler.scheduleETL();

// configure multer : upload dir. path and function to assign file name
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });

app.get("/", (req, res) => {
    let pathUri = `${appRoot}/client/uploadStatus.html`;
    res.sendFile(path.resolve(pathUri));
})

app.get("/files", (req, res) => {
	console.log('API call to get file list')
	pool.query('SELECT * FROM file_master ORDER BY file_id DESC', (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json(error)
    }
    res.status(200).json(results.rows)
  })
})

app.get("/fileDetails/:file_id", (req, res) => {
	const file_id = parseInt(req.params.file_id)
	console.log('API call to get file details ' + file_id)
	pool.query('SELECT * FROM users WHERE file_id = $1', [file_id], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json(error)
    }
    console.log(results.rows)
    res.status(200).json(results.rows)
  })
})


app.post('/uploadFile', upload.single('books'), (req, res, next)=> {
  	// req.file is the `books` file
  	// req.body will hold the text fields, if there were any
  	console.log(req.file)

  	// insert file details in master table
  	let fileName = path.parse(req.file.filename).name;  
  	console.log(fileName)	
	pool.query('INSERT INTO file_master (file_id) VALUES ($1) RETURNING *', [fileName], (error, results) => {
	    if (error) {
	      console.log(error)
	    }
	})

	// after upload is complete send user a upload status view 
 	// let pathUri = `${appRoot}/client/uploadStatus.html`;
  	// res.sendFile(path.resolve(pathUri));
  	 res.redirect('/');
})


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})