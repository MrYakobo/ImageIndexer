var fs = require('fs');
var recursive = require('recursive-readdir');
var exif = require('exif-parser')
var moment = require('moment');

recursive('img', ['*.MOV', '*.MP4'], function (err, files) {
    files.forEach(function (file, i) {
        fs.open(file, 'r', function (status, fd) {
            if (status) {
                console.error(status.message);
                return;
            }
            const l = 30000;
            read(fd, l, file).then((result) => {
                //empty
            });
        });
    });
});

function read(fd, l, file) {
    return new Promise((success) => {
        var buffer = new Buffer(l);
        fs.read(fd, buffer, 0, l, 0, function (err, num) {
            var parser = exif.create(buffer);
            parser.enableImageSize(false)
            parser.enablePointers(true)
            var result = parser.parse();
            console.log(JSON.stringify(result));
            success(result);
        });
    })
}