// import dbconn  from "../connections/dbconn";
const schedule = require('node-schedule');
const randomFile = require('select-random-file')
const fs = require('fs');
const appRoot = require("app-root-path");
const path = require('path');
const dir = 'uploads/'
let pathUri = `${appRoot}/uploads/`;

module.exports.scheduleETL = async function (msg) { 
    //we can take schedule value from config which is best practice but here we are hardcoding
    const job = schedule.scheduleJob('*/1 * * * *', async function(){
        randomFile(dir, (err, file) => {
          // if directory is empty return
          if(file==undefined){
            console.log('no file found to process and delete')
            return
          }

          // as file is not undefined/null start processing it

          // after processing the file delete it ascychronously, non blocking way
          fs.unlink(pathUri+file, (err) => {
            if (err) {
                console.log(err);
                return
            }
            console.log("File is deleted.");
            });
          })
    })
};


