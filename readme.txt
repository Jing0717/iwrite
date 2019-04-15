routes 底下新增 lib/db.js

var mysql = require('mysql');
// 建立資料庫連線
var pool  = mysql.createPool({
            user: 'root',
            password: '',
            host: 'localhost',
            database: '', 
            waitForConnections : true, 
            connectionLimit : 10       
            });
module.exports = pool;
