const mongoose = require('mongoose');

const GoogleUserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,

    },
    username: { type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    avatar : {
         type : String 
        },
    
        role : {
            type: String,
            default: "user"
        },
    

},
{timestamps: true})

module.exports = mongoose.model("GoogleUser", GoogleUserSchema);
