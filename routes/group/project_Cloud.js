var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');

router.get('/', function (req, res, next) {
    if (isNaN(req.session.user_id)) {
        res.redirect('login');
    } else {
        var pageNo = parseInt(req.query.pageNo);
        var p_id = parseInt(req.query.p_id);
        if (isNaN(pageNo) || pageNo < 1) {
            pageNo = 1;
        }

        pool.query('select * from project_info where p_id = ?', [p_id], function (err, info) {
            if (err) throw err;
            console.log(info)
            pool.query('select * from stu_info where user_identity = "t" ', function (err, tea_info) {
                if (err) throw err;
                res.render('group/project_Cloud', { data: info, p_id: p_id, tea_info: tea_info });

            });

        })
    }
});

module.exports = router;