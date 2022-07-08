var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '개발이 가장 쉬웠어요' });
});

module.exports = router;
