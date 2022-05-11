
const mongoose = require('mongoose'); 
const UserSchema = mongoose.Schema({ 
    firstName : { 
        type : String, 
        required : true
    },
    lastName : { 
        type : String, 
        required : true
    }, 
    email : { 
        type : String, 
        required : true,
        unique: true
    },
    password : { 
        type : String, 
        required : true
    },
    mobileNo : { 
        type : String, 
    },
    address : { 
        type : String, 
    }
}); 
  
const User = module.exports = mongoose.model('User', UserSchema); 