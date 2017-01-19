var db = require('./helpers/db-connect');
var moment = require('moment');

const commandLineArgs = require('command-line-args')
const optionDefinitions = [{
    name: 'sql',
    type: String
}, {
    name: 'weekday',
    type: String,
    multiple: true
}]
const options = commandLineArgs(optionDefinitions)

if (options.sql != null) {
    db.query(options.sql).then((results) => {
        console.log(JSON.stringify(results))
        process.exit();
    });
}
else if (options.weekday != null) {
    var tot = [];
    options.weekday.forEach(function (weekday, i) {
        var ind = moment().day(weekday).weekday()
        var sql = `SELECT filepath FROM imageindex WHERE EXTRACT(dow FROM date) = ${ind};`;
        db.query(sql).then((results) => {
            var p = results.map((result) => {
                return result.filepath;
            });

            tot = tot.concat(p);
            if (i === options.weekday.length - 1) {
                console.log(JSON.stringify(tot));
                process.exit();
            }
        });
    });
}
else {
    require('./cli/search-ui');
}