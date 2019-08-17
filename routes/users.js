var express = require('express');
var router = express.Router();
var UsersController = require('../Controllers/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',UsersController.singup);
router.post('/login',UsersController.login);
router.post('/search',UsersController.search);



module.exports = router;
