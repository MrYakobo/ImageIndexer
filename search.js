var db = require('./helpers/db-connect');
var moment = require('moment');

const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'sql', type: String },
  { name: 'weekday', type: String, multiple: true}
]
const options = commandLineArgs(optionDefinitions)

function queryAndShow(sql){
    return new Promise((success)=>{
        db.query(sql).then((results)=>{
            console.log(JSON.stringify(results));
            success();
        });
    });
}

if(options.sql != null){
    queryAndShow(options.sql).then(()=>{
        process.exit();
    });
}
if(options.weekday != null){
    options.weekday.forEach(function(weekday,i) {
        var ind = moment().day(weekday).weekday()
        var sql = `SELECT filepath FROM imageindex WHERE EXTRACT(dow FROM date) = ${ind};`;
        queryAndShow(sql).then(()=>{
            if(i === options.weekday.length - 1){
                process.exit();
            }
        });
    });
}
//if user didn't specify an action, show the UI
// require('./cli/search-ui');