var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({
    secret: "fd34s@!@dfa453f3DF#$D&W",
    resave: true,
    saveUninitialized: true
}));
app.use(router);

router.get('/', function (req, res, next) {
    if (isNaN(req.session.user_id)) {
        res.redirect('login');
    } else {
        var user_id = req.session.user_id;
        var p_id = parseInt(req.query.p_id);
        console.log(user_id);
        pool.query('select * from project_info where p_id = ?', [p_id], function (err, pro_info) {
            if (err) throw err;
            console.log(pro_info);
            pool.query('select * from project_task where p_id =? and task_in=?', [p_id, "1"], function (err, result) {
                console.log(result);
                res.render('group/project_Task', { p_id: p_id, data: result, user_id: user_id, pro_info: pro_info });
            })
        })
    }




});

module.exports = router;