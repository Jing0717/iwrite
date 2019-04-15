var express = require('express');
var router = express.Router();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var test = require('./routes/test');
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var studentAdd = require('./routes/studentAdd');
var controller = require('./routes/controller');

//老師
var teacherPage = require('./routes/teacher/teacherPage');
var teacherNewsAdd = require('./routes/teacher/teacherNewsAdd');
var teacherNewsEdit = require('./routes/teacher/teacherNewsEdit');
var teacherNewsDelete = require('./routes/teacher/teacherNewsDelete');
var teacherNewsDetail = require('./routes/teacher/teacherNewsDetail');
var fileupload = require('./routes/teacher/fileupload');

//學生個人
var studentPage = require('./routes/student/studentPage');
var S_article_Search = require('./routes/student/S_article_Search');
var student_Note = require('./routes/student/student_Note');
var student_Outline = require('./routes/student/student_Outline');
var student_Write = require('./routes/student/student_Write');
var student_Cloud = require('./routes/student/student_Cloud');


//學生小組
var G_Page = require('./routes/group/G_Page');
var project_Note = require('./routes/group/project_Note');
var G_NewsAdd = require('./routes/group/G_NewsAdd');
var article_Note = require('./routes/group/article_Note');
var G_NewsDelete = require('./routes/group/G_NewsDelete');
var project_Add = require('./routes/group/project_Add');
var project_Select = require('./routes/group/project_Select');
var project_Write = require('./routes/group/project_Write');
var article_Search = require('./routes/group/article_Search');
var project_Outline = require('./routes/group/project_Outline');
var project_Task = require('./routes/group/project_Task');
var project_Calendar = require('./routes/group/project_Calendar');
var project_Cloud = require('./routes/group/project_Cloud');
var project_Map = require('./routes/group/project_Map');



var app = express();

app.use(cookieParser());
app.use(session({
  secret: "fd34s@!@dfa453f3DF#$D&W",
  resave: true,
  saveUninitialized: true
}));
app.use(router);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');//view的引擎是ejs

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//根據路由選擇要執行的js檔
app.use('/test', test);
app.use('/', index);
app.use('/users', users);//開啟網頁「htpp://localhost:3000/users」會執行 <users.js>
app.use('/index', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/studentAdd', studentAdd);
app.use('/controller', controller);

//老師
app.use('/teacherPage', teacherPage);
app.use('/teacherNewsAdd', teacherNewsAdd);
app.use('/teacherNewsEdit', teacherNewsEdit);
app.use('/teacherNewsDelete', teacherNewsDelete);
app.use('/teacherNewsDetail', teacherNewsDetail);
app.use('/fileupload', fileupload);

//學生
app.use('/studentPage', studentPage);
app.use('/S_article_Search', S_article_Search);
app.use('/student_Note', student_Note);
app.use('/student_Outline', student_Outline);
app.use('/student_Write', student_Write);
app.use('/student_Cloud', student_Cloud);


//小組
app.use('/G_Page', G_Page);
app.use('/project_Note', project_Note);
app.use('/G_NewsAdd', G_NewsAdd);
app.use('/article_Note', article_Note);
app.use('/G_NewsDelete', G_NewsDelete);
app.use('/project_Add', project_Add);
app.use('/project_Select', project_Select);
app.use('/project_Write', project_Write);
app.use('/article_Search', article_Search);
app.use('/project_Outline', project_Outline);
app.use('/project_Task', project_Task);
app.use('/project_Calendar', project_Calendar);
app.use('/project_Cloud', project_Cloud);
app.use('/project_Map', project_Map);



// app.use('/left_sideBar',left_sideBar);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.get('/', function (req, res, next) {
  console.log('HAHA');
  res.render('test');
});

module.exports = app;
