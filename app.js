var express = require('express')
var app = express()
var db = require('./helpers/db-connect')
var fs = require('fs')
var path = require('path')

var iconv = require('iconv-lite');

var html = fs.readFileSync('./helpers/app.html')
var Thumbnail = require('thumbnail');

var path = require('path');

app.use("/KAMERABILDER", express.static(__dirname + '/KAMERABILDER'));
app.use("/.thumbnails", express.static(__dirname + '/.thumbnails'));

app.get('/', function (req, res) {
    // res.send('Hello World!')
    res.setHeader('Content-Type', 'text/html')
    res.send(html.toString());
})

var htmlBuild = "";

function iterate(arr, i, callback) {
    var row = arr[i];

    var src = row.filepath;
    var thumbsrc = `.thumbnails/${src.substring(0,src.length-4)}-200.jpg`;
    console.log(`thumbsrc: ${thumbsrc}`);
    //check for thumbnail
    fs.stat(thumbsrc, (err, stats) => {
        //call is called below
        var call = function () {
            htmlBuild += `<a href='${src}'><img src='${thumbsrc}'></a>`;
            console.log(`i:${i}, arrlength:${arr.length}`)
            if (i < arr.length - 1) {
                iterate(arr, i + 1, callback);
            } else {
                //if loop is done
                console.log("Done!")
                callback();
            }
        }
        if (err) {
            // console.log(err);
            console.log(`Error reading thumbnail ${thumbsrc}. Now generating new thumbnail.`)
            generateThumbnail(src).then(() => {
                call();
            });
        } else {
            call();
        }
    })
}

//All .thumbnail-paths should be encoded to wtf8 - they should only get their ÅÄÖ back when linking to the original image.
function generateThumbnail(source) {
    return new Promise((resolve) => {
        var parentDir = path.dirname(source);
        console.log(`parentdir: ${parentDir}`)
        var thumbnail = new Thumbnail(parentDir, `.thumbnails/${parentDir}`);
        //if parent dir doesn't exist in .thumbnails
        try {
            fs.mkdirSync(`.thumbnails/${parentDir}`);
        } catch (ignore) {
            console.log(`Thumbnail dir already created.`)
        }
        thumbnail.ensureThumbnail(path.basename(source), 200, null, function (err, filename) {
            // "filename" is the name of the thumb in '/path/to/thumbnails'
            if (err) {
                console.log(`Error at thumbnail creation: ${err}`)
            } else {
                console.log(`Generated file .thumbnails/${filename}`)
                resolve();
            }
        });
    })
}

app.get('/query', (req, res) => {
    if (req.query.sql == null) {
        res.send('Please enter your SQL as a GET-parameter named sql.');
    } else {
        db.query(req.query.sql).then((data) => {
            htmlBuild = "";
            iterate(data.rows, 0, ()=>{
                console.log(`SENDING HEADERS FOR QUERY ${req.query.sql}`)
                res.send(htmlBuild);
            });
        })
    }
})

app.listen(80, function () {
    console.log('Example app listening on port 80!')
})