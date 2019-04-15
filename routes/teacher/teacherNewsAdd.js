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
  var T_id = req.session.user_id;
  console.log(T_id);
  pool.query('select * from project_info where T_id = ? and apply_in = ?', [T_id,"1"], function (err, results) {
    if (err) throw err;
    console.log(results);
    res.render('teacher/teacherNewsAdd', {data:results});
  })
});

module.exports = router;