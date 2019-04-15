var express = require('express');
var router = express.Router();
var mysql = require('mysql');  //含入mysql套件
var pool = require('../lib/db.js');  //含入資料庫連線

router.get('/',function(req,res,next){
    // var hits=0;//點擊次數
    var id=req.query.id;//取得傳送的資料id
    var pageNo=parseInt(req.query.pageNo);//取得傳送的目前頁數
    pool.query('select*from article where id=?',[id],function(err,results){ //根據id讀取資料
        if(err) throw err;
        res.render('teacher/teacherNewsDetail',{data:results,pageNo:pageNo});//傳送pageNo給返回首頁使用(回到原來頁面)
        // setTimeout(function(){//讀取資料庫動作需時間,故延遲1秒才更新資料庫
        // hits = results[0].news_hits + 1;  //將原來點擊數加1
        // pool.query('update newscenter set ? where news_id=?', [{news_hits:hits}, id] , function(err, results) {  //ejs語法,更新資料庫
        //     if(err) throw err;
        //     });
        // },1000);
    });
});

module.exports = router;