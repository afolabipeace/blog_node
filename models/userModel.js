const { genSalt, hash } = require("bcrypt");
const  mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type:String,
        unique:true,
        required:true
    },
    password: {
        type: String,
        select:false
    }
})

userSchema.pre('save', async function () {
    const {password} = this;
    const salt = await genSalt(10);
    try{
        const hashedPassword = await hash(password,salt)
        this.password = hashedPassword;
    }catch(error){
        console.log(error)
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User