var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');


router.get('/', function (req, res, next) {
    if (isNaN(req.session.user_id)) {
        res.redirect('login');
    } else {
        var p_id = parseInt(req.query.p_id);
        pool.query('select * from project_table where p_id = ? and outline_in = ? and page = ?', [p_id, '1', 'preface'], function (err, preface) {
            if (err) throw err;
            pool.query('select * from project_table where p_id = ? and outline_in = ? and page = ?', [p_id, '1', 'content'], function (err, content) {
                if (err) throw err;
                pool.query('select * from project_table where p_id = ? and outline_in = ? and page = ?', [p_id, '1', 'conclude'], function (err, conclude) {
                    if (err) throw err;
                    pool.query('select * from project_table where p_id = ? and outline_in = ? and page = ?', [p_id, '1', 'reference'], function (err, reference) {
                        if (err) throw err;
                        res.render('group/project_Outline', { preface: preface, content: content, conclude: conclude, reference: reference, p_id: p_id });
                    })
                });
            });
        });
    }
});

module.exports = router;