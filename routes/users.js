var express = require('express');
var router = express.Router();
var UsersController = require('../Controllers/userController')
const isAuth = require('../middleware/is-Auth');
const { body } = require('express-validator/check');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',[
  body('email').isEmail().withMessage('please enter valid email')
    .custom((value,{ req })=>{
        return User.findOne({email:value})
        .then(userDoc =>{
            if(userDoc){
            return Promise.reject('email is already exist')
        }
    })
    }).normalizeEmail(),

],UsersController.singup);
router.post('/login',UsersController.login);
router.post('/searchdata',UsersController.searchdata);
router.get('/getall',UsersController.getAlluserdetails);
// router.patch('/_id',UsersController.updateForm);

router.post('/simpleformsubmit',UsersController.simpleFormSubmit)
router.post('/updateuser',UsersController.updateForm);
router.get('/getAllUser',UsersController.getallUsers);
router.get('/getIDByUser/:id',UsersController.getIDByUser);
router.post('/search',UsersController.searchinfo);



module.exports = router;
