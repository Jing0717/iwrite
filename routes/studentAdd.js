var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('./lib/db.js');

var messages = '';

router.get('/', function(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  res.render('studentAdd', { pageNo:pageNo, messages:messages});
});

router.post('/', function(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);  //取得輸入的類型
  var user_id = req.body.user_id;
  var user_password = req.body['user_password'];
  var mail = req.body['mail'];
  var school = req.body['school'];
  var grade = req.body['grade'];
  var user_identity = req.body['user_identity'];
  
  
  pool.query('select user_id from stu_info where user_id = ?',[user_id],function(err,results){
    if (err) throw err;
    if (results.length >= 1) {
      messages = "帳號已註冊過"
      res.render('studentAdd',{messages:messages,pageNo:pageNo})
    }else{
      pool.query('insert into stu_info set ?',[{
        user_id:user_id,
        user_password:user_password,
        mail:mail,
        school:school,
        grade:grade,
        user_identity:"s"
      }],function(err,results){
          if (err) throw err;
          res.redirect('/login');
        })
    }
  });
});

module.exports = router;