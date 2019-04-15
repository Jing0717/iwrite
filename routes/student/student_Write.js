var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');

router.get('/', function (req, res, next) {
    var p_id = parseInt(req.query.p_id);

    pool.query('select * from project_backup where p_id = ? and page = ? order by time DESC', [p_id, "preface"], function (err, prefaceBackup) {
        if (err) throw err;
        pool.query('select * from project_backup where p_id = ? and page = ?', [p_id, "content"], function (err, contentBackup) {
            if (err) throw err;
            pool.query('select * from project_backup where p_id = ? and page = ?', [p_id, "conclude"], function (err, concludeBackup) {
                if (err) throw err;
                pool.query('select * from project_backup where p_id = ? and page = ? order by time DESC', [p_id, "referece"], function (err, refereceBackup) {
                    if (err) throw err;
                    pool.query('select * from project_info where p_id = ' + p_id, function (err, results) {
                        if (err) throw err;
                        pool.query('select * from project_outline where p_id=' + p_id, function (err, results1) {
                            if (err) throw err;
                            console.log(results1);
                            if (results1 == "") {
                                var sp_Preface = "";
                                var sp_Content = "";
                                var sp_Conclude = "";
                                var sp_Reference = "";
                                res.render('student/student_Write', {
                                    data: results,
                                    data1: results1,
                                    p_id: p_id,
                                    sp_Preface: sp_Preface,
                                    sp_Content: sp_Content,
                                    sp_Conclude: sp_Conclude,
                                    sp_Reference: sp_Reference,
                                    prefaceBackup: prefaceBackup,
                                    contentBackup: contentBackup,
                                    concludeBackup: concludeBackup,
                                    refereceBackup: refereceBackup,
                                });
                            } else {
                                var str_preface = results1[0].preface;
                                var str_content = results1[0].content;
                                var str_conclude = results1[0].conclude;
                                var str_reference = results1[0].reference;

                                var sp_Preface = str_preface.split("<!>");
                                var sp_Content = str_content.split("<!>");
                                var sp_Conclude = str_conclude.split("<!>");
                                var sp_Reference = str_reference.split("<!>");
                                res.render('student/student_Write', {
                                    data: results,
                                    data1: results1,
                                    p_id: p_id,
                                    sp_Preface: sp_Preface,
                                    sp_Content: sp_Content,
                                    sp_Conclude: sp_Conclude,
                                    sp_Reference: sp_Reference,
                                    prefaceBackup: prefaceBackup,
                                    contentBackup: contentBackup,
                                    concludeBackup: concludeBackup,
                                    refereceBackup: refereceBackup,
                                });
                            }
                        });
                    });
                })
            })
        })
    })
});


module.exports = router;