
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

exports.singup = (req, res, next) => {


    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new userModel({
                name: name,
                email: email,
                mobileno: mobileno,
                username: username,
                password: hashedPw
            })
            return user.save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message1: 'user created succesfuly',
                        userId: result._id
                    })
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                })
        });
}

exports.login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;
    userModel.findOne({ username: username })
        .then(user => {
            if (!user) {
               
                res.status(400).json({'message': 'Authentication failed. User not found.'});
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
               
                res.status(400).send({'message': 'Authentication failed. Wrong Password.'});
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                'secret',
                { expiresIn: '5h' }
            )
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })
        })

        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);

        });

}

exports.search = (req, res, next) => {
    var username = req.body.username;
    userModel.findOne({ username: username })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'search successful',
                result: result.name

            })
          
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

