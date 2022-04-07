const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const appRoot = require("app-root-path");
var path = require('path');
const port = process.env.PORT || 3000

const app = express()

// const bookFilesStorage = multer.diskStorage({
//     // Destination to store image     
//     destination: 'images', 
//       filename: (req, file, cb) => {
//           cb(null, file.fieldname + '_' + Date.now() 
//              + path.extname(file.originalname))
//             // file.fieldname is name of the field (image)
//             // path.extname get the uploaded file extension
//     }
// });

app.get("/", (request, response) => 
    {
        // console.log(__dirname);
        // response.sendFile(path.resolve(__dirname + "../../../client/html/home.html"));
        let pathUri = `${appRoot}/client/home.html`;
        response.sendFile(path.resolve(pathUri));
    }
)

app.post('/uploadBooks', upload.single('books'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file)
  res.send('file uploaded')
})


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})