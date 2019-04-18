var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('./lib/db.js');
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

var messages = '';  //錯誤訊息

//使用者在首頁按「鎖」圖示後執行的程式碼
//通常開啟網頁是以「GET」方式向伺服器發出請求，會執行「router.get」方法的程式碼
router.get('/', function (req, res, next) {
  var messages = '';
  var pageNo = parseInt(req.query.pageNo);  //取得傳送的目前頁數
  var user_id = req.session.user_id;
  if (req.session.user_id) {  //session值存在表示使用者已登入
    pool.query("select * from stu_info where user_id=?", [user_id], function (err, results) {
      if (err) throw err;
      if (results[0].user_identity == 't') {  //帳號及密碼皆正確
        req.session.user_id = user_id;  //設定session
        res.redirect('teacherPage');  //開啟管理頁面
      } else if (results[0].user_identity == 's') {  //帳號及密碼皆正確
        req.session.user_id = user_id;  //設定session
        req.session.nickname = results[0].nickname;
        res.redirect('project_Select');  //開啟群組頁面
      } 
    });
  } else {  //session值不存在就到登入頁面
    res.render('login', { messages: messages, pageNo: pageNo });
  }
});
//若使用者「submit」型態的按鈕，而且表單 (form) 的「method」屬性值設為「POST」，此時瀏覽器會以「POST」方式向伺服器發出請求，就會執行「router.post」方法的程式碼。
router.post('/', function (req, res) {  //按登入系統鈕
  var pageNo = parseInt(req.query.pageNo);//取得傳送過來的首頁目前頁數
  var user_id = req.body['user_id'];  //取得輸入的帳號
  var user_password = req.body['user_password'];  //取得輸入的密碼
  //加入了「required」參數，表示使用者一定要輸入資料，否則系統不會送出表單，並且會顯示提示訊息
  pool.query("select * from stu_info where user_id=?", [user_id], function (err, results) {  //根據帳號讀取資料
    if (err) throw err;
    if (results.length == 0) {  //帳號不存在
      messages = "帳號不存在！"
      res.render('login', { messages: messages, pageNo: pageNo })
    } else if (results[0].user_password != user_password) {  //密碼不正確  results.欄位名稱
      messages = "密碼不正確！"
      res.render('login', { messages: messages, pageNo: pageNo })
    } else if (results[0].user_identity == 't') {  //帳號及密碼皆正確
      req.session.user_id = user_id;
      res.redirect('teacherPage');  //開啟管理頁面
    } else if (results[0].user_identity == 's') {  //帳號及密碼皆正確
      req.session.user_id = user_id;  //設定session
      req.session.nickname = results[0].nickname;
      console.log(req.session.nickname);
      messages = ""
      res.redirect('project_Select');  //開啟群組頁面
    } 
  });
});

module.exports = app;