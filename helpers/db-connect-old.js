var pg = require('pg');
var c = require('../setup/credentials')

var config = {
    user: c.username,
    database: c.db,
    password: c.password,
    host: 'localhost',
    port: 5432,
    max: 1,
    idleTimeoutMillis: 30000,
};

exports.query = function (sql, data) {
    return new Promise((success) => {
        var client = new pg.Client(config);
        client.connect();
        client.query(sql, data, function (err, res) {
            if(err){
                console.log(`Warning: Query "${sql.substring(0,25)}..." didn't finish.`);
            }
            success(res);
            client.end();
        });
    });
}