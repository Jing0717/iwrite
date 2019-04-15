var express = require('express');
var router = express.Router();
//var app = require('../app');
router.get('/', function (req, res, next) {
    console.log('HAHA');
    res.render('test');
});
  
  module.exports = router;