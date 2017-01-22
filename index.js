var fs = require('fs')
var recursive = require('recursive-readdir');
var exif = require('exif-parser')
var path = require('path');

const primarytable = 'table2';

function ignore(file, stats) {
    return !stats.isDirectory() && path.extname(file).toLowerCase() !== ".jpg";
}

const commandLineArgs = require('command-line-args')
const optionDefinitions = [{
    name: 'cache',
    type: String
}, {
    name: 'start',
    type: Number
},
{
    name: 'noCache',
    type: Boolean
}]

const options = commandLineArgs(optionDefinitions)

//Ctrl+C event
process.on('SIGINT', function () {
    console.log(`i=${i}`);
    writeSQL();
});

//Global counter
var i = 0;
//Takes arguments
if (process.argv[2] != null) {
    i = parseInt(process.argv[2]);
}

var files = [];
//total sql
var sql = "";

fs.readFile('cache.json', (err, _files) => {
    if (err) {
        if(options.cache != null){
            recursive(options.cache, (err1, _files)=>{
                if(err1){
                    throw new Error(`Could not find the provided directory '${options.cache}'.`)
                }
                files = _files;
                fs.writeFile('cache.json',files,(err2)=>{
                    if(err2){
                        throw new Error('Could not write cache.json to disk.')
                    }
                })
                iterate();
            })  
        }
        else if(options.noCache){

        }

    }
    else{
        files = JSON.parse(_files);
        iterate();
    }
});

var timeStart = Date.now();
//Lim is how many files that pass until a log is outputted (so that one can tell if something is happening - a smaller number makes the program more verbose)
const lim = 100;
var errors = [];

function iterate() {
    file = files[i];
    fs.open(file, 'r', function (status, fd) {
        if (status) {
            console.log("Error:" + status.message);
            return;
        }

        const l = Math.pow(2, 16);
        var buffer = new Buffer(l);

        fs.read(fd, buffer, 0, l, 0, function (err, num) {
            if (err) {
                console.log(err);
                process.exit();
            }
            try {
                var parser = exif.create(buffer);
                parser.enableImageSize(false)
                parser.enablePointers(true)
                var result = parser.parse();

                if (result.error) {
                    errors.push(file);
                    console.log('Error in parsing');
                } else {
                    if (i % lim === 0) {
                        var tot = Date.now() - timeStart;
                        console.log(`${(i/files.length*100).toFixed(2)}% done\t\ti=${i}\t\tfile='${file}\t\tAvg time/picture: ${(tot/lim).toFixed(2)} ms`);
                        timeStart = Date.now();
                    }
                    // var date = moment.unix(result.tags.CreateDate).format('YYYY-MM-DD HH:MM:SS');
                    var d;
                    if(typeof(result.tags.CreateDate)=='undefined'){
                        d = 0;
                    }
                    else{
                        d = result.tags.CreateDate;
                    }
                    // console.log(d);
                    var date = `to_timestamp(${d})`;
                   
                    var data = [
                        file,
                        date,
                        result.tags.FocalLength,
                        result.tags.ApertureValue,
                        result.tags.ISO,
                        result.tags.LensModel,
                        result.tags.Location,
                        result.tags.Model
                    ];

                    var s = "";
                    data.forEach(function (element,i) {
                        if (typeof (element) === 'undefined')
                            s += `null,`;
                        else if(i==1)
                            s += `${element},`;
                        else {
                            s += `'${element}',`;
                        }
                    });
                    s = s.substring(0, s.length - 1);
                    sql += `INSERT INTO ${primarytable} (filepath,date,focallength,aperture,iso,lensmodel,location,cameramodel) VALUES (${s});`;

                    fs.close(fd, () => {
                        //if finished
                        if (i === files.length - 1) {
                            writeSQL();
                        }
                        //else, keep on iterating
                        else {
                            i++
                            iterate();
                        }
                    });
                }
            } catch (err1) {
                console.log(err1)
                errors.push(file);
            }
        });
    });
}

function writeSQL() {
    fs.writeFile('outputsql.sql', sql, (err) => {
        if (err)
            console.log(err);
        console.log('Wrote generated SQL to outputsql.sql.');
        console.log(`Process ended. ${errors.length} files skipped due to invalid EXIF-data:${errors.join('\n')}`)
        process.exit();
    });
}