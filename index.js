var fs = require('fs');
var recursive = require('recursive-readdir');
var exif = require('exif-parser')
var db = require('./helpers/db-connect');
var moment = require('moment');

const primarytable = 'imageindex';

recursive('img', ['*.MOV','*.MP4'], function (err, files) {
    files.forEach(function (file, i) {
        fs.open(file, 'r', function (status, fd) {
            if (status) {
                console.error(status.message);
                return;
            }
            const l = 30000;
            read(fd,l,file).then((result)=>{
                var data = [
                    file,
                    moment(result.tags.CreateDate),
                    result.tags.FocalLength,
                    result.tags.ApertureValue,
                    result.tags.ISO,
                    result.tags.LensModel,
                    result.tags.Location,
                    result.tags.Model
                ];
                console.log(data[1]);
                db.query(`INSERT INTO ${primarytable} (filepath,date,focallength,aperture,iso,lensmodel,location,cameramodel) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`, data);
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