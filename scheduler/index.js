const schedule = require('node-schedule');
const randomFile = require('select-random-file')
const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
const path = require('path');
const dir = 'uploads/'
const pool = require('../db.js')



module.exports.scheduleETL = async function (msg) { 
    //we can take schedule value from config which is best practice but here we are hardcoding
    const job = schedule.scheduleJob('*/1 * * * *', async function(){

        // randomly pick files for processing
        randomFile(dir, (err, file) => {
            
            // if directory is empty and no file found then return
            if(file==undefined){
                console.log(' no file to process')
                return
            }
            // as file is not undefined/null start processing it
            const fileName = dir + file;
            let json = csvToJson.getJsonFromCsv(fileName);
            let countOfInsert = 0
            for(let i=0; i<json.length;i++){
                // console.log(json[i]);
                let first_name = json[i]["first_name"],
                last_name = json[i]["last_name"],
                email = json[i]["email"],
                gender = json[i]["gender"]
                age = json[i]["age"]
                zip = json[i]["zip"]
                registered = json[i]["registered"]
                file_id = path.parse(file).name;
                pool.query('INSERT INTO users (first_name, last_name, email, gender, age,zip,registered,file_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [first_name, last_name, email, gender, age,zip,registered, file_id], (error, results) => {
                    if (error) {
                      console.log(error)
                    }
                })
                countOfInsert++ 
            }
            console.log('Total records inserted = ' + countOfInsert + ' for ' + dir + file)
            // after processing the file delete it ascychronously, non blocking way
            fs.unlink(dir + file, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                console.log(dir + file + " File is deleted.");
            });
        })
    })
};


