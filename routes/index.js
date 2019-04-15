//使用者開啟網站首頁「htpp://localhost:3000」執行的程式
var express = require('express');
var router = express.Router();
var mysql = require('mysql');  //含入mysql套件
var pool = require('./lib/db.js');  //含入資料庫連線
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

var linePerPage=5;  // 每頁5筆資料

/* GET home page. */
// 要抓取POST值 可以用 body
// 要抓取GET值 可以用 query
// 要抓取Routing值 可以用 params
router.get('/', function(req, res, next) {

  res.redirect('login');

});

  

module.exports = router;
