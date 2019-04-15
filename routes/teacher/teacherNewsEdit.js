var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');

var id = 0;

router.get('/', function(req, res, next) {
  var categories = ['公告', '更新', '活動', '其他'];
  id = req.query.id;  //取得傳送的資料id
  var pageNo = parseInt(req.query.pageNo);
  pool.query('select * from newscenter where news_id=?', [id], function(err, results) {  //根據id讀取資料
    if(err) throw err;
    res.render('teacher/teacherNewsEdit', { data:results, pageNo:pageNo, categories:categories});
  });
});

router.post('/', function(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  
  var ntype = req.body['news_type'];  //取得輸入的類型
  var nsubject = req.body['news_subject'];
  var npreface = req.body['news_preface'];
  var ncontent = req.body['news_content'];
  var nconclude = req.body['news_conclude'];
  var nreference = req.body['news_reference'];
  var neditor = req.body['news_editor'];
  var nok = req.body['news_ok'];
  
  pool.query('update newscenter set ? where news_id=?', [{  //更新資料
      news_type:ntype,
      news_subject:nsubject,
      news_preface:npreface,
      news_content:ncontent,
      news_conclude:nconclude,
      news_reference:nreference,
      news_editor:neditor,
      news_ok:nok,
    }, id] , function(err, results) {
      if(err) throw err;
      res.redirect('/teacherPage?pageNo=' + pageNo);  //回到原來頁數的管理頁面
  });
});

module.exports = router;