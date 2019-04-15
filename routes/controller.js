var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('./lib/db.js');
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

router.post('/', function (req, res, next) {
    var action = req.body.action;
    // console.log(action);

    switch (action) {

        // 教師協助資源收藏到專案的收藏
        case "collect":
            var articleID = req.body.articleid;
            var p_id = req.body.p_id;
            // console.log(articleID);
            pool.query('select * from article where id = ?', [articleID], function (err, result1) {
                if (err) throw err;
                console.log(result1);

                pool.query('select filename from project_article where filename = ? AND p_id = ?', [result1[0].filename, p_id], function (err, results) {
                    console.log(results);
                    if (err) throw err;
                    if (results.length >= 1) {
                        res.end("已收藏")
                    } else {
                        pool.query('insert into project_article set ?', [{
                            p_id: p_id,
                            article_type: result1[0].article_type,
                            article_subject: result1[0].article_subject,
                            article_date: new Date(),
                            filename: result1[0].filename,
                        }], function (err, results) {
                            if (err) throw err;
                            res.end('收藏成功');
                        })
                    }
                });
            });
            break;

        //單篇文章儲存筆記
        case "save_Note":
            var article_id = req.body.article_id;
            var p_id = req.body.p_id;
            var note = req.body.note;
            var user_id = req.body.user_id;
            var article_subject = req.body.article_subject;
            var page = req.body.page;

            pool.query('select * from project_article where id=?', [article_id], function (err, results0) {  //根據id讀取資料
                if (err) throw err;
                pool.query('select * from stu_info where user_id = ?', [user_id], function (err, result1) {
                    if (err) throw err;
                    pool.query('insert into note set ?', [{
                        uid: user_id,
                        user_Nickname: result1[0].nickname,
                        p_id: p_id,
                        content: note,
                        time: new Date(),
                        article_id: article_id,
                        article_subject: article_subject,
                        page: page,
                    }], function (err, results) {
                        if (err) throw err;
                        res.end('筆記成功');
                        // res.render('group/article_Note', { data: results0, p_id: p_id, user_id: user_id, id: article_id, note: note });
                    });
                })
            });

            break;

        case "search_Note":
            var articleID = req.body.articleid;
            var p_id = req.body.p_id;
            // console.log(articleID);
            pool.query('select * from note where id = ?', [articleID], function (err, result1) {
                if (err) throw err;
                console.log(result1);
            });
            break;

        //專案日曆新增活動
        case "add_Event":
            var p_id = req.body.p_id;
            var start = req.body.startTime;
            var end = req.body.endTime;
            var title = req.body.title;
            console.log(start);
            console.log(end);
            pool.query('insert into events set ?', [{
                p_id: p_id,
                start: start,
                end: end,
                title: title,
            }], function (err, result1) {
                if (err) throw err;
                console.log(result1);
                res.end("新增事件成功");

            });
            break;

        case "delete_Event":
            var id = req.body.id;
            pool.query('delete from events where id =' + id, function (err, result1) {
                if (err) throw err;
                console.log(result1);
                res.end("刪除事件成功");
            });
            break;

        case "update_Event":
            var p_id = req.body.p_id;
            var start = req.body.startTime;
            var end = req.body.endTime;
            var title = req.body.title;
            var id = req.body.id;
            pool.query('update events set ? where id=?', [{
                p_id: p_id,
                start: start,
                end: end,
                title: title,
            }, id], function (err, result1) {
                if (err) throw err;
                console.log(result1);
                res.end("更新事件成功");
            });
            break;

        case "save_Preface":
            var p_id = req.body.p_id;
            var preface = req.body.outline1;
            pool.query('INSERT INTO project_outline SET  ? ON DUPLICATE KEY UPDATE preface = ?', [{
                p_id: p_id,
                preface: preface
            }, preface], function (err, results) {
                if (err) throw err;
                res.end("更新前言大綱成功");
            });

            break;

        case "save_Content":
            var p_id = req.body.p_id;
            var content = req.body.outline1;
            console.log(content);
            pool.query('INSERT INTO project_outline SET  ? ON DUPLICATE KEY UPDATE content = ?', [{  //更新資料
                p_id: p_id,
                content: content,
            }, content], function (err, results) {
                if (err) throw err;
                res.end("更新正文大綱成功");
            });

            break;
        case "save_Conclude":
            var p_id = req.body.p_id;
            var conclude = req.body.outline1;
            console.log(conclude);
            pool.query('INSERT INTO project_outline SET  ? ON DUPLICATE KEY UPDATE conclude = ?', [{  //更新資料
                p_id: p_id,
                conclude: conclude,
            }, conclude], function (err, results) {
                if (err) throw err;
                res.end("更新結論大綱成功");
            });

            break;
        case "save_Reference":
            var p_id = req.body.p_id;
            var reference = req.body.outline1;
            console.log(reference);
            pool.query('INSERT INTO project_outline SET  ? ON DUPLICATE KEY UPDATE reference = ?', [{  //更新資料
                p_id: p_id,
                reference: reference,
            }, reference], function (err, results) {
                if (err) throw err;
                res.end("更新引註資料大綱成功");
            });

            break;

        case "save_task_change":
            var p_id = req.body.p_id;
            var movetask_no = req.body.movetask_no;
            var moveover_name = req.body.moveover_name;

            pool.query('update project_task set ? where id = ?', [{  //更新資料

                belong_taskname: moveover_name,

            }, movetask_no], function (err, results) {
                if (err) throw err;
                res.end("更新成功");
            });

            break;

        case "new_task":
            var p_id = req.body.p_id;
            var task_mem = req.body.task_mem;
            var task_content = req.body.task_content;
            var belong_taskname = req.body.belong_taskname;

            pool.query('insert  into project_task set ?', [{  //更新資料
                p_id: p_id,
                task_mem: task_mem,
                belong_taskname: belong_taskname,
                task_content: task_content,
                start: new Date(),
            }], function (err, results) {
                if (err) throw err;
                res.end("更新成功");
            });

            break;

        case "delete_task":
            var movetask_no = req.body.movetask_no;

            pool.query('update project_task set ? where id = ?', [{  //更新資料

                task_in: "0",
                belong_taskname: "del-area",

            }, movetask_no], function (err, results) {
                if (err) throw err;
                res.end("刪除任務成功");
            });

            break;

        case "change_preface":
            var p_id = req.body.p_id;

            pool.query('update project_info set ? where p_id = ?', [{  //更新資料

                preface_inuse: "1",

            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("GET編輯前言權限成功");
            });

            break;
        case "change_content":
            var p_id = req.body.p_id;

            pool.query('update project_info set ? where p_id = ?', [{  //更新資料

                content_inuse: "1",

            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("GET編輯正文權限成功");
            });

            break;
        case "change_conclude":
            var p_id = req.body.p_id;

            pool.query('update project_info set ? where p_id = ?', [{  //更新資料

                conclude_inuse: "1",

            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("GET編輯結論權限成功");
            });

            break;
        case "change_reference":
            var p_id = req.body.p_id;

            pool.query('update project_info set ? where p_id = ?', [{  //更新資料

                reference_inuse: "1",

            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("GET編輯引註資料權限成功");
            });

            break;

        case "savePreface":
            var p_id = req.body.p_id;
            var preface = req.body.preface;
            console.log(preface);

            pool.query('update project_info set ? where p_id = ?', [{  //更新資料

                preface_inuse: "0",
                preface: preface,

            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("儲存前言成功");
            });

            break;

        case "saveContent":
            var p_id = req.body.p_id;
            var content = req.body.content;
            console.log(content);

            pool.query('update project_info set ? where p_id = ?', [{  //更新資料

                content_inuse: "0",
                content: content,

            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("儲存正文成功");
            });

            break;

        case "saveConclude":
            var p_id = req.body.p_id;
            var conclude = req.body.conclude;
            console.log(conclude);

            pool.query('update project_info set ? where p_id = ?', [{  //更新資料

                conclude_inuse: "0",
                conclude: conclude,

            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("儲存結論成功");
            });

            break;

        case "saveReference":
            var p_id = req.body.p_id;
            var reference = req.body.reference;
            console.log(reference);

            pool.query('update project_info set ? where p_id = ?', [{  //更新資料

                reference_inuse: "0",
                reference: reference,

            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("儲存引註資料成功");
            });

            break;

        case "change_stage":
            var p_id = req.body.p_id;
            var move_stage = req.body.move_stage;
            pool.query('update project_info set ? where p_id = ?', [{

                stage: move_stage,

            }, p_id], function (err, result1) {
                if (err) throw err;
                console.log(result1);
                res.end("變更專案階段成功");
            });
            break;

        //老師拒絕成為指導老師
        case "reject_apply":
            var p_id = req.body.p_id;
            var reject_reason = req.body.reject_reason;
            pool.query('update project_info set ? where p_id = ?', [{

                apply_in: "0",
                reject_reason: reject_reason,

            }, p_id], function (err, result1) {
                if (err) throw err;
                res.end("拒絕申請成功");
            });
            break;

        case "invite_teacher":
            var p_id = req.body.p_id;
            var sel_tea = req.body.sel_tea;
            var T_nickname = req.body.T_nickname;

            pool.query('update project_info set ? where p_id = ?', [{
                apply_in: "1",
                T_id: sel_tea,
                stage: "指導中",
                T_nickname: T_nickname,
            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("申請中，等候老師同意");
            })
            break;

        case "save_backup":
            var p_id = req.body.p_id;
            var content = req.body.content;
            var s_id = req.session.user_id;
            var nickname = req.session.nickname;
            var phase = req.body.phase;
            var phase_id = req.body.id;
            pool.query('insert into project_backup set ? ', [{
                p_id: p_id,
                s_id: s_id,
                nickname: nickname,
                page: phase,
                backup_content: content,
                phase_id: phase_id,
                time: new Date(),
            }], function (err, results) {
                if (err) throw err;
                console.log(results);
                res.end("備份成功");
            })
            break;
        // 10/31 刪除大綱
        case "delete_outline":
            var p_id = req.body.p_id;
            var id = req.body.id;
            var s_id = req.session.user_id;
            // var nickname = req.session.nickname;
            pool.query('update project_table set ? where id = ?', [{
                outline_in: "0"
            }, id], function (err, results) {
                if (err) throw err;
                console.log(results);
                res.end("刪除大綱成功");
            })
            break;

        case "save_outline":
            var p_id = req.body.p_id;
            var page = req.body.page;
            var new_outline = req.body.new_outline;
            var s_id = req.session.user_id;
            // var nickname = req.session.nickname;
            pool.query('insert into project_table set ?', [{
                p_id: p_id,
                s_id: s_id,
                outline: new_outline,
                page: page,
                outline_in: "1",
                time: new Date(),
            }], function (err, results) {
                if (err) throw err;
                console.log(results);
                res.end("儲存大綱成功");
            })
            break;

        case "change_outline":
            var id = req.body.id;
            var outline = req.body.outline;
            console.log(outline);
            // var nickname = req.session.nickname;
            pool.query('update  project_table set ? where id = ? ', [{
                outline: outline,
            }, id], function (err, results) {
                if (err) throw err;
                console.log(results);
                res.end("更改大綱成功");
            })
            break;

        case "save_content":
            var id = req.body.id;
            var content = req.body.content;
            // var nickname = req.session.nickname;
            pool.query('update  project_table set ? where id = ? ', [{
                content: content,
            }, id], function (err, results) {
                if (err) throw err;
                console.log(results);
                res.end("更改內文成功");
            })
            break;

        case "save_Suggest":
            var p_id = req.body.p_id;
            var T_suggest = req.body.T_suggest;

            pool.query('update project_info set ? where p_id = ?', [{
                T_suggest: T_suggest,
            }, p_id], function (err, results) {
                if (err) throw err;
                res.end("建議更改成功");
            })
            break;

        default:
            res.end("controller.js error")
            break;
    }



})

module.exports = router;