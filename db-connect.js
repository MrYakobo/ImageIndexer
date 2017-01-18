var pg = require('pg');
var c = require('./credentials')

var config = {
    user: c.username,
    database: 'localdb',
    password: c.password,
    host: 'localhost',
    port: 5432,
    max: 1,
    idleTimeoutMillis: 30000,
};

var pool = new pg.Pool(config);

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
})

exports.query = function (sql, data) {
    return new Promise((success) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(sql, data, function (err, result) {
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                success(result.rows);
            });
        });
    });
}