const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName:{

        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    companyDesc:{
        type:String

    },
    brandName:{
   type:String,
   required:true
    }


});

module.exports = User = mongoose.model('users', UserSchema);