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

router.get('/', function (req, res, next) {
    if (isNaN(req.session.user_id)) {
        res.redirect('login');
    } else {
        var p_id = parseInt(req.query.p_id);

        pool.query('select p_name from project_info where p_id = ?', [p_id], function (err, results1) {
            console.log(results1)
            pool.query('select * from project_table where p_id = ? and page = ? and outline_in = ?', [p_id, "preface", 1], function (err, preface) {
                pool.query('select * from project_table where p_id = ? and page = ? and outline_in = ?', [p_id, "content", 1], function (err, content) {
                    pool.query('select * from project_table where p_id = ? and page = ? and outline_in = ?', [p_id, "conclude", 1], function (err, conclude) {
                        pool.query('select * from project_table where p_id = ? and page = ? and outline_in = ?', [p_id, "reference", 1], function (err, reference) {

                            var data = [];

                            if (err) {
                                res.send(JSON.stringify(data));
                            }
                            if (preface == "") {
                                var json1 = JSON.stringify(data);
                                res.render('group/project_Map', { p_id: p_id, DBtask: json1, });
                            } else {
                                //逐筆取出資料, 加入data陣列中

                                //取出若干欄位資料
                                var p_name = results1[0].p_name;
                                var Arr_preface = new Array();　// 宣告一個新的陣列
                                for (j = 0; j < preface.length; j++) {
                                    Arr_preface[j] = {
                                        name: preface[j].outline,
                                        parent: "前言"
                                    };　// 開始建立陣列
                                }
                                var Arr_content = new Array();　// 宣告一個新的陣列
                                for (j = 0; j < content.length; j++) {
                                    Arr_content[j] = {
                                        name: content[j].outline,
                                        parent: "正文"
                                    };　// 開始建立陣列
                                }
                                var Arr_conclude = new Array();　// 宣告一個新的陣列
                                for (j = 0; j < conclude.length; j++) {
                                    Arr_conclude[j] = {
                                        name: conclude[j].outline,
                                        parent: "結論"
                                    };　// 開始建立陣列
                                }
                                var Arr_reference = new Array();　// 宣告一個新的陣列
                                for (j = 0; j < reference.length; j++) {
                                    Arr_reference[j] = {
                                        name: reference[j].outline,
                                        parent: "引註資料"
                                    };　// 開始建立陣列
                                }

                                //將資料加入物件中
                                var item = {};
                                item.name = p_name;
                                item.parent = "null";
                                item.children = [
                                    {
                                        name: "前言",
                                        parent: p_name,
                                        children: Arr_preface
                                    },
                                    {
                                        name: "正文",
                                        parent: p_name,
                                        children: Arr_content
                                    },
                                    {
                                        name: "結論",
                                        parent: p_name,
                                        children: Arr_conclude
                                    },
                                    {
                                        name: "引註資料",
                                        parent: p_name,
                                        children: Arr_reference
                                    },
                                ];
                                //將存有資料的物件加入陣列
                                data.push(item);
                                var json1 = JSON.stringify(data);
                                res.render('group/project_Map', { p_id: p_id, DBtask: json1, });
                            }
                        });
                    })
                })
            })
        })
    }
});

module.exports = router;