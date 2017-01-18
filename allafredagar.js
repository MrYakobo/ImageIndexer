var moment = require('moment')

const commandLineArgs = require('command-line-args')
 
const optionDefinitions = [
  { name: 'day', alias: 'd', type: String },
  { name: 'years', type: String, type: String}
]

const options = commandLineArgs(optionDefinitions)
if(options.day == null || options.years == null){
    require('./ui.js');
    process.exit();
}
 
var start = moment().subtract(parseInt(options.years),'years')
var today = moment()

var diff = today.diff(start)/8.64e7;
var ind = moment().day(options.day).weekday()
var str = ""
//find all dates that are of the day that the user specified
for(var i = 0; i < diff; i++){
    var thisDay = start.add(1,'days');
    if(thisDay.weekday() === ind){
        str += "fotodatum: " + thisDay.format('YYYY-MM-DD') + " OR ";
    }
}
str = str.substring(0,str.length-4);
console.log(str)