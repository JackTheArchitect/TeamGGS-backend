var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup/', userController.singup)
router.post('/signin', userController.signin)
router.get('/check', userController.check)

router.get('/', userController.getAllUsers)

module.exports = router;
