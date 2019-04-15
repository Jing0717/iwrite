var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var formidable = require('formidable');
var fs = require('fs');
var flow = require('nimble');
var async = require('async');

app.use(cookieParser());
app.use(session({
    secret: "fd34s@!@dfa453f3DF#$D&W",
    resave: true,
    saveUninitialized: true
}));
app.use(router);

var linePerPage = 5;

var EventEmitter = require("events");
// var form;
router.post('/', function (req, res) {
   var form = new formidable.IncomingForm();
    async.waterfall([
        //第一步:上傳檔案到指定資料夾
        function (next) {
            console.log('1');
            var count=1;
            form.parse(req, function (err, flelds, files) {
                if (err) throw err;
                console.log(flelds,files);
                
                if(count===1){
                    count++;
                    next(err, {
                        flelds:flelds,files:files
                    });
                }else{
                    console.log(count);
                }
                
            });
        },function (rst2, next) {
            console.log('4');
               // console.log(flelds);
               var oldpath = rst2.files.filetoupload.path;
               var newpath = 'C:/Users/user/Desktop/news/public/file/' + rst2.files.filetoupload.name;
            var filename = rst2.files.filetoupload.name;
            var article_subject = rst2.flelds.article_subject;
            var article_type = rst2.flelds.article_type;
            var result = { filename, article_subject, article_type };
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                // return res.end();
                next(err, result);
            });
        },
        //第二步:將上傳檔案的名稱寫入資料庫
        function (rst1, next) {
            console.log('2');
            // console.log(rst1);
            pool.query('insert into article set ?', [{
                article_subject: rst1.article_subject,
                article_type: rst1.article_type,
                article_date: new Date(),
                filename: rst1.filename
            }], function (err, results) {
                if (err) throw err;
                //判斷是否有相同標題
                next(err, results);
            });
        }
    ], function (err, rst) {
        console.log('3');
        if (err) throw err;
        // console.log(rst);
        res.redirect('/teacherPage');
    });
});








// router.post('/', function (req, res) {
//     form.parse(req, function (err, flelds, files) {
//         if (err) throw err;
//         var crazy = new EventEmitter();
//         var oldpath = files.filetoupload.path;
//         var newpath = 'C:/Users/user/Desktop/news/views/file/' + files.filetoupload.name;
//         fs.rename(oldpath, newpath, function (err) {
//             if (err) throw err;
//             console.log('rename');
//             // res.write('File uploaded and moved!');
//             // return res.end();
//         });
//         carazy.emit('Data');
//         // return res.end();
//     });
//     crazy.on('Data', function () {
//         form.parse(req, function (err, flelds, files) {
//             if (err) throw err;
//             var oldpath = files.filetoupload.path;
//             var newpath = 'C:/Users/user/Desktop/news/views/file/' + files.filetoupload.name;
//             console.log('database');
//             pool.query('insert into article set ?', [{
//                 article_date: new Date(),
//                 article_name: files.filetoupload.name
//             }], function (err, results) {
//                 if (err) throw err;
//                 return res.end();
//             });
//         });
//     });
//     return res.redirect('/teacherPage');
// });




// router.post('/', function (req, res) {
//     var pageNo = parseInt(req.query.pageNo);
//     if (isNaN(pageNo) || pageNo < 1) {
//         pageNo = 1;
//         console.log('post');
//     }
//     // var article_name = files.filetoupload.name;

//     form.parse(req, function (err, fields, files) {
//         if (err) throw err;
//         var oldpath = files.filetoupload.path;
//         var newpath = 'C:/Users/user/Desktop/news/views/file/' + files.filetoupload.name;
//         fs.rename(oldpath, newpath, function (err) {
//             if (err) throw err;
//             console.log('rename');
//             // res.write('File uploaded and moved!');
//             return res.end();
//         });
//         pool.query('insert into article set ?', [{
//             article_date: new Date(),
//             article_name: files.filetoupload.name
//         }], function (err, results) {
//             if (err) throw err;
//             return res.end();
//         });
//         return res.end();
//     });
//     return res.redirect('/teacherPage');
// });
module.exports = router;