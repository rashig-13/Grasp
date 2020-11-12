var express=require("express");
var router=express.Router();
var blog=require("../models/blog");
var comment=require("../models/comment");

router.get("/blog/:id/comments/new",isLoggedIn,function(req,res){
    blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }else{
            res.render("newcomment.ejs",{blog:blog});
        }
    });
 });
 
 router.post("/blog/:id/comments",isLoggedIn,function(req,res){
    blog.findById(req.params.id,function(err,blog){
     if(err){
         console.log(err);
         res.redirect("/secret");
     }else{
          
         comment.create(req.body.comment,function(err,comment){
             if(err){
                 console.log(err);
                 res.redirect("/home");
             }else{
               comment.author.id=req.user._id;
               comment.author.username=req.user.username;
               comment.save();
                 blog.comments.push(comment);
                 blog.save();
                 console.log(comment);
                 res.redirect("/blogs/" + blog._id);
             }
         });
     }
 });
 });
 //comment edit form
 router.get("/blog/:id/comments/:comment_id/edit",function(req,res){
     comment.findById(req.params.comment_id,function(err,foundcomment){
         if(err){
             res.redirect("back");
         }else{
            res.render("editcomment",{blog_id:req.params.id,comment:foundcomment});
         }
     })
 });
 //update comment
 router.put("/blog/:id/comments/:comment_id",function(req,res){
     comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
         if(err){
             console.log(err);
             res.redirect("back");
         }else{
             res.redirect("/blogs/"+req.params.id);
         }
     });
 });
 //comment delete route
 router.get("/blog/:id/comments/:comment_id",function(req,res){
     comment.findByIdAndRemove(req.params.comment_id,function(err){
         if(err){
             res.redirect("back");
         }else{
            res.redirect("/blogs/"+req.params.id); 
         }
     })
 })
 function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 module.exports=router;