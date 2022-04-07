// import dbconn  from "../connections/dbconn";
const schedule = require('node-schedule');

module.exports.scheduleUpload = async function (msg) { 
    //we can take schedule value from config which is best practice but here we are hardcoding
    const job = schedule.scheduleJob('*/1 * * * *', async function(){
        console.log('The answer to life, the universe, and everything! every minute');
    })
};


