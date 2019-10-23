const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const userformModel=require('../models/simpleform');

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

exports.searchdata = (req, res, next) => {
    var username = req.body.username;
    userModel.findOne({ username: username })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'search successful',
                result: result

            })
          
        })

        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getAlluserdetails = (req, res, next) => {
    userModel.find()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'get all details',
                result: result

            })
          
        })
        
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

// exports.updateForm =(req,res,next) => {
//     const id = req.body._id;
//     const updateOps = {};

//     for( const ops of req.body) {
//         updateOps[ops.PropName]=ops.value;
//     }

//     userModel.update({_id:id},{$set:updateOps})
//     exec()
//     .then(result =>{
//         console.log(result);
//         res.status(200).json(result);
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(500).json({
//             error:err
//         })
        
//     });
// }


// update form in chat-React project
exports.simpleFormSubmit=(req,res,next)=>{
    debugger;
    // console.log(req.body);
const name=req.body.Name;
const email=req.body.email;
const password=req.body.password;

const user=new userformModel({
    Name:name,
    email:email,
    password:password
})
// console.log(user);
return user.save()
.then(result=>{
    console.log(result);
    res.status(200).json({
        message:"Form submitted successful",
        user_id:result._id

    })
})
.catch(err=>{
    if(!err.statusCode){
        err.statusCode=500;
    }
    next(err);
})
}

exports.getallUsers=(req,res,next)=>{
    userformModel.find()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: 'list of register user',
            result: result

        }) 
    })  
}

exports.getIDByUser=(req,res,next)=>{
    userformModel.findById({_id: req.params.id})
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: 'user based on id',
            result: result

        }) 
    })  
}

exports.updateForm =(req,res) => {
    debugger;
    console.log(req.body)
    const id = req.body.id;
    userformModel.update({_id:id},{$set:{
        
        Name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }})
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
        
    });
}


// exports.updateForm = (req, res) => {
//     const id = req.body.id;
//     userformModel.findById({ _id: id }, function (err, employee) {

//         if (!employee) {
//             return next(new Error('Could not load Document'));
//         }
//         else {
//             employee.Name = req.body.Name;
//             employee.email = req.body.email;
//             employee.password = req.body.password;
//             employee.save().then(employee => {
//                 res.json('Successfully Updated');
//             })
//                 .catch(err => {
//                     res.status(400).send("unable to update the database");
//                 });



//         }

//     })
// }

// searching information

exports.searchinfo=(req,res)=>{
    let {serachText}=req.body;
    if(serachText && serachText.trim()){

   

    req.body.serachText = req.body.serachText.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
    userformModel.find({
        $or:[
            {"Name":{ $regex:req.body.serachText, $options: 'i' }},
            {"email":{$regex:req.body.serachText, $options: 'i' }},
            {"password":{$regex:req.body.serachText, $options: 'i'}}
        ]
    })
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: 'search successful',
            result: result

        }) 
    }) 
    }
    else{
        res.status(200).json({
            message: 'mandatory fields are missing',
            result: [],
            statusCode:400

        }) 
    } 
}