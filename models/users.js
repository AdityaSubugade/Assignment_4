const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    productName:{
        type: String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    productDescription:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        required:true
    },

    image:{
        type:String,
        required:true
    },
    created:{
        type: Date,
        required:true,
        default: Date.now
    }

});
module.exports= mongoose.model('user', userSchema);