var express = require('express');
var router = express.Router();
var mysql = require('mysql');  //含入mysql套件
var pool = require('../lib/db.js');  //含入資料庫連線
var login_session = require('../session_user.js');

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

var messages ='';

router.get('/', function (req, res, next) {
    if (isNaN(req.session.user_id)) {
        res.redirect('login');
    } else {
        var user_id = req.session.user_id;
        pool.query('select * from project_info where member01 = ' + user_id + ' OR member02 = ' + user_id + ' OR member03 = ' + user_id + '', function (err, results) {
            if (err) throw err;
            res.render('group/project_Select', {
                data: results
            })
        })
    }
});

module.exports = router;