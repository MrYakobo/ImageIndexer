var express = require('express')
var app = express()
var db = require('./helpers/db-connect')
var fs = require('fs')
var path = require('path')

var html = fs.readFileSync('./helpers/app.html')
var Thumbnail = require('thumbnail');


function generateThumbnail(source) {
    return new Promise((resolve) => {
        var thumbnail = new Thumbnail(path.dirname(source), '.thumbnails');
        try{
        fs.mkdirSync(`.thumbnails/${path.dirname(source)}`);
        }
        catch(ignore){
            console.log(ignore)
        }
        thumbnail.ensureThumbnail(path.basename(source), 100, null, function (err, filename) {
            // "filename" is the name of the thumb in '/path/to/thumbnails'
            if (err){
                console.log(`Error at thumbnail creation: ${err}`)
            }
            console.log(`Generated file .thumbnails/${filename}`)
            resolve();
        });
    })
}

var path = require('path');

//app.use(express.static(__dirname)); // Current directory is root
app.use("/KAMERABILDER", express.static(__dirname + '/KAMERABILDER'));
app.use("/.thumbnails", express.static(__dirname + '/.thumbnails'));

// app.use(express.static('KAMERABILDER'))
// app.use(express.static('.thumbnails'))

app.get('/', function (req, res) {
    // res.send('Hello World!')
    res.setHeader('Content-Type', 'text/html')
    res.send(html.toString());
})

var htmlBuild = "";

function iterate(arr, i) {
    return new Promise((resolve, reject) => {
        var row = arr[i];

        var src = row.filepath;
        var thumbsrc = `.thumbnails/${src.substring(0,src.length-4)}-100.jpg`;
        console.log(`Thumbsrc: ${thumbsrc}`)
        //check for thumbnail
        fs.stat(thumbsrc, (err, stats) => {
            //call is called below
            var call = function () {
                htmlBuild += `<a href='${src}'><img src='${thumbsrc}'></a>`;
                if (i < arr.length - 1) {
                    iterate(arr, i + 1);
                } else {
                    resolve();
                }
            }
            if (err) {
                console.log(err);
                console.log(`Error reading thumbnail ${thumbsrc}. Now generating new thumbnail`)
                generateThumbnail(src).then(() => {
                    call();
                });
            } else {
                call();
            }
        })
    })
}

app.get('/query', (req, res) => {
    db.query(req.query.sql).then((data) => {
        htmlBuild = "";
        iterate(data.rows, 0).then((resolve, reject) => {
            console.log('sending headers')
            res.send(htmlBuild);
        });
    })
})

app.listen(80, function () {
    console.log('Example app listening on port 80!')
})