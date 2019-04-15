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

var linePerPage = 5;

router.get('/', function (req, res, next) {
  // res.redirect('logout');
  var pageNo = parseInt(req.query.pageNo);
  var p_id = parseInt(req.query.p_id);
  if (isNaN(pageNo) || pageNo < 1) {
    pageNo = 1;
  }

  pool.query('select count(*) as cnt from stu_keep where p_id = ' + p_id + '', function (err, results) {
    if (err) throw err;
    var totalLine = results[0].cnt;
    var totalPage = Math.ceil(totalLine / linePerPage);

    pool.query('select * from stu_keep where p_id = ' + p_id + ' order by news_date desc limit ?, ?', [(pageNo - 1) * linePerPage, linePerPage], function (err, results) {
      if (err) throw err;
      res.render('student/studentPage', { data: results, pageNo: pageNo, totalLine: totalLine, totalPage: totalPage, linePerPage: linePerPage, p_id: p_id });
    });
  });
});

module.exports = router;