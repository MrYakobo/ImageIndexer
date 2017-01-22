var pg = require('pg');
var c = require('../setup/credentials')

var config = {
    user: c.username,
    database: c.db,
    password: c.password,
    host: 'localhost',
    port: 5432,
    max: 10000,
    idleTimeoutMillis: 0,
};

process.setMaxListeners(0);
var pool = new pg.Pool(config);

exports.query = function (sql, data) {
    return new Promise((success) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(sql, data, function (err, result) {
                done();

                if (err) {
                    //file already exists in DB
                    if (err.code === '23505') {
                        console.log('Warning: File exists already in db')
                    } else if (err.code === '22007') {
                        console.log(`Invalid date in data: ${data}`);
                    } else {
                        console.log(err)
                    }
                }
                else{
                    success(result);
                }
            });
        });

        pool.on('error', function (err, client) {
            console.error('idle client error', err.message, err.stack)
        })
    })
}