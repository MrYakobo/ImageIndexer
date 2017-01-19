var moment = require('moment')
/*const commandLineArgs = require('command-line-args')
 
const optionDefinitions = [
  { name: 'day', alias: 'd', type: String },
  { name: 'years', type: String, type: String}
]

const options = commandLineArgs(optionDefinitions)
if(options.day == null || options.years == null){
    require('../cli/ui.js');
    process.exit();
}
 */
exports.get = function(years, day){
    var start = moment().subtract(parseInt(years),'years')
    var today = moment()

    var diff = today.diff(start)/8.64e7;
    var ind = moment().day(day).weekday()
    var arr = [];
    //find all dates that are of the day that the user specified
    for(var i = 0; i < diff; i++){
        var thisDay = start.add(1,'days');
        if(thisDay.weekday() === ind){
            arr.push(thisDay);
        }
    }
    return arr;
}