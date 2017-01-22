var fs = require('fs');
var exif = require('exif-parser')
const xmpReader = require('xmp-reader');

var file = process.argv[2];

// fs.open(file, 'r', function (status, fd) {
//     if (status) {
//         console.error(status.message);
//         return;
//     }

//     const l = Math.pow(2, 16);
//     var buffer = new Buffer(l);

//     fs.read(fd, buffer, 0, l, 0, function (err, num) {
//         if (err) {
//             console.log(err);
//             process.exit();
//         }
//         try {
//             var parser = exif.create(buffer);
//             parser.enableImageSize(false)
//             parser.enablePointers(true)
//             var result = parser.parse();
//             console.log(JSON.stringify(result.tags))
//         } catch (err1) {
//             console.log(err1)
//         }
//     })
// })

// xmpReader.fromFile(file, (err, data) => {
//   if (err) console.log(err);
//   else console.log(JSON.stringify(data))
// });

// fs.readFile("img/gil.JPG", function(err, stats) {
//     //Stars at 18246!
//     // console.log(JSON.stringify(stats.toJSON()))
// });

var fs = require('fs');

fs.open('img/gil.JPG', 'r', function(status, fd) {
    if (status) {
        console.log(status.message);
        return;
    }   
    const l = Math.pow(2,18);
    var buffer = new Buffer(l);
    fs.read(fd, buffer, 0, l, 0, function(err, num) {
        var bytes = JSON.stringify(buffer.toString('utf8', 0, num));
        var reg = /<rdf:Bag> <rdf:li>(.*?)<\/rdf:li> <\/rdf:Bag>/g;
        var result;
        while((result = reg.exec(bytes)) !== null) {
            console.log(result)
            // console.log(JSON.stringify())
        }
    });
});