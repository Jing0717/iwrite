var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var formidable = require('formidable');

app.use(cookieParser());
app.use(session({
  secret: "fd34s@!@dfa453f3DF#$D&W",
  resave: true,
  saveUninitialized: true
}));
app.use(router);

var linePerPage = 6;

router.get('/', function (req, res, next) {
  if (isNaN(req.session.user_id)) {
    res.redirect('login');
  } else {
    var pageNo = parseInt(req.query.pageNo);
    var p_id = parseInt(req.query.p_id);
    if (isNaN(pageNo) || pageNo < 1) {
      pageNo = 1;
    }
    var type = "小論文";
    var type1 = "書籍";
    var type2 = "網路";

    pool.query('select count(*) as cnt from project_article where p_id = ? and article_type = ?', [p_id, type], function (err, results) {
      if (err) throw err;
      var totalLine = results[0].cnt;
      var totalPage = Math.ceil(totalLine / linePerPage);
      pool.query('select * from project_article where p_id = ? and article_type = ? order by article_date desc limit ?, ?', [p_id, type, (pageNo - 1) * linePerPage, linePerPage], function (err, results) {
        if (err) throw err;

        pool.query('select count(*) as cnt from project_article where p_id = ? and article_type = ?', [p_id, type1], function (err, results1) {
          if (err) throw err;
          var totalLine1 = results1[0].cnt;
          var totalPage1 = Math.ceil(totalLine1 / linePerPage);
          pool.query('select * from project_article where p_id = ? and article_type = ? order by article_date desc limit ?, ?', [p_id, type1, (pageNo - 1) * linePerPage, linePerPage], function (err, results1) {
            if (err) throw err;

            pool.query('select count(*) as cnt from project_article where p_id = ? and article_type = ?', [p_id, type2], function (err, results2) {
              if (err) throw err;
              var totalLine2 = results2[0].cnt;
              var totalPage2 = Math.ceil(totalLine2 / linePerPage);
              pool.query('select * from project_article where p_id = ? and article_type = ? order by article_date desc limit ?, ?', [p_id, type2, (pageNo - 1) * linePerPage, linePerPage], function (err, results2) {
                if (err) throw err;

                pool.query('select * from project_info where p_id = ?', [p_id], function (err, info) {
                  if (err) throw err;
                  res.render('group/G_Page', { data: results, data1: results1, data2: results2, info: info, pageNo: pageNo, totalLine: totalLine, totalPage: totalPage, linePerPage: linePerPage, p_id: p_id });

                })
              })
            })
          })
        })
      })
    })
  }
})















router.post('/', function (req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var p_id = parseInt(req.query.p_id);
  if (isNaN(pageNo) || pageNo < 1) {
    pageNo = 1;
  }
  var search_Word = {};
  var search_Word = req.body['search_Word'];

  pool.query("select count(*) as cnt from article where article_subject LIKE ?", [search_Word], function (err, results1) {
    if (err) throw err;
    var totalLine = results1[0].cnt;
    var totalPage = Math.ceil(totalLine / linePerPage);
    pool.query('select * from project_info where p_id = ? ', [p_id], function (err, info) {
      if (err) throw err;
      pool.query('select * from article where article_subject LIKE ? order by article_date desc limit ?, ?', [search_Word, (pageNo - 1) * linePerPage, linePerPage], function (err, results) {
        if (err) throw err;
        res.render('group/article_Search', { data: results, info: info, pageNo: pageNo, totalLine: totalLine, totalPage: totalPage, linePerPage: linePerPage, p_id: p_id, searchWord: searchWord });
      })
    })
  })
})


module.exports = router;