var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../lib/db.js');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var moment = require('moment');


app.use(cookieParser());
app.use(session({
    secret: "fd34s@!@dfa453f3DF#$D&W",
    resave: true,
    saveUninitialized: true
}));
app.use(router);


router.get('/', function (req, res, next) {
    if (isNaN(req.session.user_id)) {
        res.redirect('login');
    } else {
        var p_id = parseInt(req.query.p_id);
        pool.query('select * from events where p_id=?', [p_id], function (err, results) {
            // if (err) throw err;
            // res.render('group/project_Calendar', { data: result, p_id: p_id });
            //回傳資料(初值為空陣列)
            var data = [];
            // console.log(results);

            if (err) {
                res.send(JSON.stringify(data));
            } else {
                //逐筆取出資料, 加入data陣列中
                for (var i = 0; i < results.length; i++) {
                    //取出若干欄位資料
                    var id = results[i].id;
                    var start = new Date(results[i].start).toLocaleString();
                    var end = new Date(results[i].end).toLocaleString();
                    var title = results[i].title;
                    // console.log(start);
                    // console.log(end);

                    //顏色測試
                    var dataHoje = (new Date()).toLocaleString();
                    // console.log(new Date(dataHoje));
                    // console.log(dataHoje.toLocaleString());
                    // console.log(dataHoje);

                    if ((Date.parse(end)).valueOf() < (Date.parse(dataHoje)).valueOf()) {
                        var color = '#AEC6CF';//螢光綠
                    } else {
                        var color = '#77DD77';//灰色
                    }

                    //將資料加入物件item中
                    var item = {};
                    item.id = id;
                    item.start = moment(start).format();;
                    item.end = moment(end).format();
                    item.title = title;
                    item.color = color;


                    //將存有資料的物件加入陣列
                    data.push(item);
                }
                var json1 = JSON.stringify(data);
                // console.log(json1);
                // req.session.json = json;

                //將陣列轉為JSON格式字串, 回傳給呼叫者
                res.render('group/project_Calendar', { data: results, p_id: p_id, DBevent: json1 });
            }
        });
    }
});

module.exports = router;