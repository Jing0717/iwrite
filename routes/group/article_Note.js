var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');
//  使用 session 需含入及使用 cookie-parser 及 express-session 套件
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

var id = 0;

router.get('/', function (req, res, next) {
  if (isNaN(req.session.user_id)) {
    res.redirect('login');
  } else {
    id = req.query.id;  //取得文章的id
    var pageNo = parseInt(req.query.pageNo);
    var p_id = parseInt(req.query.p_id);
    var user_id = req.session.user_id;
    if (isNaN(pageNo) || pageNo < 1) {
      pageNo = 1;
    }
    console.log(p_id);
    var sql = "select count(*) as cnt from note where p_id = ? AND article_id = ?;";
    pool.query(sql, [p_id, id], function (err, results0) {
      if (err) throw err;
      console.log(results0[0].cnt);
      pool.query('select * from project_article where id=?', [id], function (err, results) {  //根據id讀取資料
        if (err) throw err;
        pool.query('select * from note where p_id=? AND article_id = ? order by page;', [p_id, id], function (err, result1) {
          if (err) throw err;
          console.log(result1);
          res.render('group/article_Note', { data0: results0, data: results, data1: result1, pageNo: pageNo, p_id: p_id, user_id: user_id, id: id });
        });
      });
    })
  }
});


module.exports = router;