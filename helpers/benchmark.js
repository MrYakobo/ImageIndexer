var db = require('./db-connect');
var i = 0;
function q(){
    i++;
    if(i > 32853)
        return;

    db.query('insert into benchmarknoid (value) VALUES ($1::int)',[Math.floor(Math.random()*100000000)]).then(()=>{
        q();
    })
}
q();