var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();


app.use(cookieParser());
app.use(session({
    secret: "fd34s@!@dfa453f3DF#$D&W",
    resave: true,
    saveUninitialized: true
}));
app.use(router);

router.get('/', function (req, res, next) {
    var p_id = parseInt(req.query.p_id);
    if (isNaN(req.session.user_id)) {
        res.redirect('login');
    } else {
        pool.query('select * from project_table where p_id = ? and outline_in = ? and page = ?', [p_id, '1', 'preface'], function (err, preface) {
            if (err) throw err;
            pool.query('select * from project_table where p_id = ? and outline_in = ? and page = ?', [p_id, '1', 'content'], function (err, content) {
                if (err) throw err;
                pool.query('select * from project_table where p_id = ? and outline_in = ? and page = ?', [p_id, '1', 'conclude'], function (err, conclude) {
                    if (err) throw err;
                    pool.query('select * from project_table where p_id = ? and outline_in = ? and page = ?', [p_id, '1', 'reference'], function (err, reference) {
                        if (err) throw err;
                        pool.query('select * from project_backup where p_id = ? and page = ? order by time desc', [p_id, "preface"], function (err, prefaceBackup) {
                            if (err) throw err;
                            pool.query('select * from project_backup where p_id = ? and page = ? order by time desc', [p_id, "content"], function (err, contentBackup) {
                                if (err) throw err;
                                pool.query('select * from project_backup where p_id = ? and page = ? order by time desc', [p_id, "conclude"], function (err, concludeBackup) {
                                    if (err) throw err;
                                    pool.query('select * from project_backup where p_id = ? and page = ? order by time desc', [p_id, "reference"], function (err, referenceBackup) {
                                        if (err) throw err;
                                        pool.query('select * from project_info where p_id = ' + p_id, function (err, results) {
                                            if (err) throw err;
                                            pool.query('select * from project_table where p_id=' + p_id, function (err, results1) {
                                                if (err) throw err;
                                                res.render('group/project_Write', {
                                                    data: results,
                                                    data1: results1,
                                                    p_id: p_id,
                                                    preface: preface,
                                                    content: content,
                                                    conclude: conclude,
                                                    reference: reference,
                                                    prefaceBackup: prefaceBackup,
                                                    contentBackup: contentBackup,
                                                    concludeBackup: concludeBackup,
                                                    referenceBackup: referenceBackup,

                                                });
                                            });
                                        })
                                    })
                                })
                            })
                        });
                    })
                });
            });
        });
    }
})
module.exports = router;