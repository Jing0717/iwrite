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
var id = 0;

router.get('/', function (req, res, next) {
  if (isNaN(req.session.user_id)) {
    res.redirect('login');
  } else {
    id = req.query.id;  //取得傳送的資料id
    var pageNo = parseInt(req.query.pageNo);
    var p_id = parseInt(req.query.p_id);
    pool.query('select * from project_article where id=?', [id], function (err, results) {  //根據id讀取資料
      if (err) throw err;
      res.render('group/G_NewsDelete', { data: results, pageNo: pageNo, p_id: p_id });
    });
  }
});

router.post('/', function (req, res, next) {
  id = req.query.id;
  var pageNo = parseInt(req.query.pageNo);
  var p_id = parseInt(req.query.p_id);
  pool.query('delete from project_article where id=?', [id], function (err, results) {  //刪除資料
    if (err) throw err;
    res.redirect('/G_Page?pageNo=' + pageNo + '&p_id=' + p_id);
  });
});

module.exports = router;