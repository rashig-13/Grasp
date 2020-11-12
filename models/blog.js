var mongoose=require("mongoose");
var blogschema=new mongoose.Schema({
    title:String,
    image:String,
    imageid:String,
    type:String,
    content:String,
    created:{type:Date,default:Date.now},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }
    ]
});

module.exports=mongoose.model("blog",blogschema);