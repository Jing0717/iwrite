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

var messages = '';

router.get('/', function (req, res, next) {
  if (isNaN(req.session.user_id)) {
    res.redirect('login');
  } else {
    pool.query('select user_id from stu_info where user_identity = "t" ', function (err, teacher) {
      if (err) throw err;

      res.render('group/project_Add', { teacher: teacher });
    });
  }
})
router.post('/', function (req, res, next) {
  var user_id = req.session.user_id;
  var action = req.body.action;
  var p_name = req.body.p_name;
  var member02 = req.body['member02'];


  switch (action) {
    case "G3_Add":
      var member03 = req.body['member03'];
      pool.query('select nickname from stu_info where user_id = ? ', [user_id], function (err, nickname01) {
        if (err) throw err;
        pool.query('select nickname from stu_info where user_id = ? ', [member02], function (err, nickname02) {
          if (err) throw err;
          pool.query('select nickname from stu_info where user_id = ? ', [member03], function (err, nickname03) {
            if (err) throw err;
            pool.query('insert into project_info set ?', [{
              p_name: p_name,
              member01: user_id,
              nickname01: nickname01[0].nickname,
              member02: member02,
              nickname02: nickname02[0].nickname,
              member03: member03,
              nickname03: nickname03[0].nickname,
              group_type: "g",
            }], function (err, results) {
              if (err) throw err;
              setTimeout(function () {
                res.end('三人專案申請成功');
              }, 2000);
            });
          });
        });
      });
      break;

    case "G2_Add":
      pool.query('select nickname from stu_info where user_id = ? ', [user_id], function (err, nickname01) {
        if (err) throw err;
        pool.query('select nickname from stu_info where user_id = ? ', [member02], function (err, nickname02) {
          if (err) throw err;
          pool.query('insert into project_info set ?', [{
            p_name: p_name,
            member01: user_id,
            nickname01: nickname01[0].nickname,
            member02: member02,
            nickname02: nickname02[0].nickname,
            group_type: "g",
          }], function (err, results) {
            if (err) throw err;
            setTimeout(function () {
              res.end('2人專案申請成功');
            }, 2000);
          });
        });
      });
      break;

    case "S1_Add":
      var s_name = req.body.s_name;
      pool.query('select nickname from stu_info where user_id = ? ', [user_id], function (err, nickname01) {
        if (err) throw err;
        pool.query('insert into project_info set ?', [{
          p_name: s_name,
          member01: user_id,
          nickname01: nickname01[0].nickname,
          group_type: "s",
        }], function (err, results) {
          if (err) throw err;
          setTimeout(function () {
            res.end('個人專案申請成功');
          }, 2000);
        });
      });
      break;
  }

});


module.exports = router;