var express = require('express');
var router = express.Router();
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

router.get('/', function(req, res, next) {
  delete req.session.username;  //刪除使用者session
  delete req.session.user_id;
  res.redirect('/index');  //回到首頁
});

module.exports = app;