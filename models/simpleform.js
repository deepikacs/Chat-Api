const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema=new Schema({
Name:{
    type:String,
    required:"Please enter your name"
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
}
});
module.exports = mongoose.model('simpleForm',userSchema);