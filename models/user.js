var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");
var userschema=new mongoose.Schema({
    username:String,
    email:{type:String ,unique:true,required:true},
    password:String,
    isVerified: { type: Boolean, default: false },
    resetPasswordToken:String,
    resetPasswordExpires: Date,
    verifyToken:String,
    verifyExpires :Date
});
userschema.plugin(passportlocalmongoose);
module.exports=mongoose.model("user",userschema);