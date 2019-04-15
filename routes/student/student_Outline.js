var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');


router.get('/', function (req, res, next) {
    var p_id = parseInt(req.query.p_id);
    pool.query('select * from project_outline where p_id=' + p_id, function (err, results) {
        console.log(results);
        if (err) throw err;
        if (results == "") {
            var sp_Preface = "";
            var sp_Content = "";
            var sp_Conclude = "";
            var sp_Reference = "";
            res.render('student/student_Outline', { data: results, p_id: p_id, sp_Preface: sp_Preface, sp_Content: sp_Content, sp_Conclude: sp_Conclude, sp_Reference: sp_Reference });
        } else {
            var str_preface = results[0].preface;
            var str_content = results[0].content;
            var str_conclude = results[0].conclude;
            var str_reference = results[0].reference;
            console.log(str_preface);
            // console.log(str_content);

            var sp_Preface = str_preface.split("<!>");
            var sp_Content = str_content.split("<!>");
            var sp_Conclude = str_conclude.split("<!>");
            var sp_Reference = str_reference.split("<!>");
            console.log(sp_Preface);
            // console.log(sp_Content);

            res.render('student/student_Outline', { data: results, p_id: p_id, sp_Preface: sp_Preface, sp_Content: sp_Content, sp_Conclude: sp_Conclude, sp_Reference: sp_Reference });

        }
    });
});

module.exports = router;