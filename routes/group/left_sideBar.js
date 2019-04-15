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

router.get('/', function(req, res, next) {
  var p_id = parseInt(req.query.p_id);
    pool.query('select * from G_keep where p_id = '+p_id+' order by news_date desc' ,function(err,results) {
      if(err) throw err;
      res.render('group/left_sideBar', { data:results, p_id:p_id});      
    })

});

module.exports = router;