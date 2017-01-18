var fs = require('fs');
var recursive = require('recursive-readdir');
var exif = require('exif-parser')
var Benchmark = require('benchmark');
var db = require('./db-connect');
var suite = new Benchmark.Suite;

recursive('img', ['*.MOV','*.MP4'], function (err, files) {
    files.forEach(function (file, i) {
        fs.open(file, 'r', function (status, fd) {
            if (status) {
                console.log(status.message);
                return;
            }
            let start = Date.now();
            const l = 30000;
            read(fd,l,file).then((result)=>{
                console.log(result.tags.CreateDate);
                //TODO: Modify DB so that it can take more properties.
                //FocalLength, ApertureValue, ISO, LensModel, Location

                db.query('INSERT INTO kamerabilder (filepath,date) VALUES ($1,$2)',[file,result.tags.CreateDate]);
            });
        });
    });
});

function read(fd,l,file) {
    return new Promise((success) => {
        var buffer = new Buffer(l);
        fs.read(fd, buffer, 0, l, 0, function (err, num) {
            // console.log(file)
            // console.log(buffer.toString('utf8', 0, num));
            var parser = exif.create(buffer);
            parser.enableImageSize(false)
            parser.enablePointers(true)
            var result = parser.parse();
            // console.log(result)
            success(result);
        });
    })
}