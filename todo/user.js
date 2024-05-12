const mongoose = require ('mongoose')
const userSchema = new mongoose.Schema ({
    username: {
        type : String,
        required : true,
    },

    email: {
        type : String,
        required : true,
    },

    address: {
        type  : String,

    },
    password: {
        type : String,
        required :true,
        
    },
});
const User = mongoose.model("user", userSchema)
module.exports = User;