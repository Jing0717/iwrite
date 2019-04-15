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

var message = '';

router.get('/', function (req, res, next) {
  if (isNaN(req.session.user_id)) {
    res.redirect('login');
  } else {
    var pageNo = parseInt(req.query.pageNo);
    var p_id = parseInt(req.query.p_id);
    res.render('group/G_NewsAdd', { pageNo: pageNo, message: message, p_id: p_id });
  }
});

router.post('/', function (req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var p_id = parseInt(req.query.p_id);
  var ntype = req.body['news_type'];  //取得輸入的類型
  var nsubject = req.body['news_subject'];
  var npreface = req.body['news_preface'];
  var ncontent = req.body['news_content'];
  var nconclude = req.body['news_conclude'];
  var nreference = req.body['news_reference'];
  var neditor = req.body['news_editor'];
  var note = req.body['note'];

  var nok = req.body['news_ok'];

  pool.query('insert into G_keep set ?', [{  //新增資料 
    news_type: ntype, //資料欄位名稱:要寫入的值
    news_date: new Date(),
    news_subject: nsubject,
    news_preface: npreface,
    news_content: ncontent,
    news_conclude: nconclude,
    news_reference: nreference,
    news_editor: neditor,
    news_ok: nok,
    news_hits: 0,
    p_id: p_id,
  }], function (err, results) {
    if (err) throw err;
    res.redirect('/G_Page?pageNo=' + pageNo + '&p_id=' + p_id);
  });
});

module.exports = router;