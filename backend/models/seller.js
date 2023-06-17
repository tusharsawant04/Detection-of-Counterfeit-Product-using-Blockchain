const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    sellercode: {
        type: String,
        required: true
    },
    semail: {
        type: String,
        required: true
    },
    spassword: {
        type:String,
        required: true
    },
    sfullName:{

        type:String,
        required:true
    },
    sphoneNumber:{
        type:Number,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = Seller = mongoose.model('seller', UserSchema);