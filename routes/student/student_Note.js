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
var linePerPage = 6;

router.get('/', function (req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var p_id = parseInt(req.query.p_id);
  if (isNaN(pageNo) || pageNo < 1) {
    pageNo = 1;
  }
  var searchWord = req.query.searchWord;

  if (searchWord) {
    var sql = "select count(*) as cnt from note where article_subject LIKE ?;";
    pool.query(sql, ['%' + searchWord + '%'], function (err, results1) {
      if (err) throw err;
      var totalLine = results1[0].cnt;
      var totalPage = Math.ceil(totalLine / linePerPage);
      pool.query('select * from note where p_id = ? ', [p_id], function (err, info) {
        if (err) throw err;
        var sql123 = "select * from note where article_subject LIKE ? order by time desc limit ?, ?";
        pool.query(sql123, ['%' + searchWord + '%', (pageNo - 1) * linePerPage, linePerPage], function (err, results) {
          if (err) throw err;
          res.render('student/student_Note', { data: results, info: info, pageNo: pageNo, totalLine: totalLine, totalPage: totalPage, linePerPage: linePerPage, p_id: p_id, searchWord: searchWord });
        })
      })
    })
  }

  else {
    pool.query('select count(*) as cnt from (SELECT * FROM note where p_id = ? ORDER BY time DESC) as total  group by article_subject ORDER BY time DESC ', [p_id], function (err, total) {
      if (err) throw err;
      console.log(total);
      pool.query('SELECT * FROM (SELECT * FROM note where p_id = ? ORDER BY time DESC) as total   GROUP BY  article_subject ORDER BY time DESC ', [p_id], function (err, groups) {
        if (err) throw err;
        console.log(groups);
        res.render('student/student_Note', { pageNo: pageNo, p_id: p_id, searchWord: searchWord, groups: groups, total: total });
      })
    })
  }
});


router.post('/', function (req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var p_id = parseInt(req.query.p_id);
  var search_Word = {};
  var search_Word = req.body['search_Word'];

  pool.query("select count(*) as cnt from note where content LIKE ?", [search_Word], function (err, results1) {
    if (err) throw err;
    var totalLine = results1[0].cnt;
    var totalPage = Math.ceil(totalLine / linePerPage);
    pool.query('select * from note where p_id = ? ', [p_id], function (err, info) {
      if (err) throw err;
      pool.query('select * from note where content LIKE ? order by time desc limit ?, ?', [search_Word, (pageNo - 1) * linePerPage, linePerPage], function (err, results) {
        if (err) throw err;
        res.render('student/student_Note', { data: results, info: info, pageNo: pageNo, totalLine: totalLine, totalPage: totalPage, linePerPage: linePerPage, p_id: p_id, searchWord: searchWord });
      })
    })
  })
})

module.exports = router;