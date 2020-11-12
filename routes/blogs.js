var express=require("express");
var router=express.Router();
var blog=require("../models/blog");
var multer=require("multer");
var storage=multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,Date.now() + file.originalname);
    }
});
var imageFilter = function(req,file,cb){
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}
var upload=multer({storage:storage,fileFilter:imageFilter})
var cloudinary=require("cloudinary");
cloudinary.config({
    cloud_name:'dkl3vrvns',
    api_key:'751731645692319',
    api_secret:'3uzDJs6iO_Lgm0Yda22BHLHaSeM'
});


//NEW ROUTE
router.get("/blogs/new",function(req,res){
    res.render("new");
});
//CREATE ROUTE
// router.post("/secret",upload.single('image'),function(req,res){
//      var title=req.body.title;
//      var image = req.body.image ? req.body.image : "/images/temp.png";
//    //var imageid = req.body.imageid ? req.body.imageid : "/images/temp.png";
//      var imageid = req.body.imageid;

//      var type=req.body.type;
// var content=req.body.content;
//     // add author to campground
//    var author = {
//       id: req.user._id,
//       username: req.user.username
//     }
   
// cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
//     // add cloudinary url for the image to the campground object under image property
//     if(err)
//    return res.redirect("back");
//   image = result.secure_url;
//  imageid = result.public_id;
//     var newblog={title:title,image:image,imageid:imageid,type:type,content:content,author:author}
   
//         blog.create(newblog, function(err, blog) {
//             if (err) {
//                 console.log(err);
//               req.flash('error', err.message);
//               return res.redirect('back');
//             }
//            res.redirect('/blogs/' + blog.id);
//          // res.redirect('/');
//           });
        
//         });
// });

//////////////////////////////////////////////////////////
router.post("/secret", upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the campground object under image property
      req.body.blog.image = result.secure_url;
      // add image's public_id to campground object
      req.body.blog.imageid = result.public_id;
      // add author to campground
      req.body.blog.author = {
        id: req.user._id,
        username: req.user.username
      }
      blog.create(req.body.blog, function(err, cblog) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/blogs/' + blog.id);
      });
    });
});

router.get("/secret",function(req,res){
   
    res.render("common"); 
});

router.get("/secret/art",isLoggedIn,function(req,res){
    blog.find({type:"art"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});
router.get("/secret/technology",isLoggedIn,function(req,res){
    blog.find({type:"technology"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});
router.get("/secret/fiction",isLoggedIn,function(req,res){
    blog.find({type:"fiction"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});
router.get("/secret/sports",isLoggedIn,function(req,res){
    blog.find({type:"sports"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});
router.get("/secret/culture",isLoggedIn,function(req,res){
    blog.find({type:"culture"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});
router.get("/secret/lifestyle",isLoggedIn,function(req,res){
    blog.find({type:"lifestyle"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});
router.get("/secret/fitness",isLoggedIn,function(req,res){
    blog.find({type:"fitness"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});
router.get("/secret/health",isLoggedIn,function(req,res){
    blog.find({type:"culture"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});
router.get("/secret/travel",isLoggedIn,function(req,res){
    blog.find({type:"culture"},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("secret",{blogs:blogs});
        }
    });
   
});


//SHOW ROUTE


router.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id).populate("comments").exec(function(err,foundblog){
        if(err){
            console.log(err);
        }else{
            console.log(foundblog);
            res.render("show.ejs",{blog:foundblog});
        }
    });
});
//EDIT ROUTE
router.get("/blogs/:id/edit",checkblogownership,function(req,res){
    
        blog.findById(req.params.id,function(err,foundblog){
            res.render("edit",{blog:foundblog});
             });
});

// //UPDATE ROUTE
// router.put("/blogs/:id",checkblogownership,upload.single('image'), function(req,res){
    
//     blog.findById(req.params.id,async function(err,updatedblog){
//         if(err){
//             console.log(err);
//             res.redirect("/secret");
//         }else{
//             if(req.file.path){
//                 try{
//                    await cloudinary.v2.uploader.destroy(blog.imageid);
//                     var result=await cloudinary.v2.uploader.upload(req.file.path);
//                     blog.image = result.secure_url;
//                      blog.imageid = result.public_id;
                    
  
//                 } catch(err) {
//                     console.log(err);
//                  // req.flash('error',error.message);
//                   return res.redirect('back');
//                 }
                
//            }
//            blog.title = req.body.title;
//            blog.content = req.body.content;
//            blog.save();

//             res.redirect("/blogs/" + req.params.id); 
//         }
//     }); 
//  });

// router.put("/blogs/:id",upload.single('image'),checkblogownership,function(req,res){
   

//     blog.findById(req.params.id,async function(err,updatedblog){
//         if(err){
//             req.flash("error ",err.message);
//             console.log(err);
//             return res.redirect("back");
//         }else{
//             if(req.file)
//             {
//            try{
//                await cloudinary.v2.uploader.destroy(blog.imageId); 
//                var result = await cloudinary.v2.uploader.upload(req.file.path);
//                blog.imageId=result.public_id;
//                blog.image=result.secure_url;

//            }
//            catch(err){
//                console.log(err);
//             req.flash("error ",err.message);
//             return res.redirect("back");
//            }
//         }

//             blog.title=req.body.title;
//             blog.content=req.body.content;
//             blog.save();
//             res.flash("success","Successfully Updated!")
//             res.redirect("/blogs/" + req.params.id);
//         }
//     });

   
// });
router.put("/blogs/:id",checkblogownership,upload.single('image'),function(req,res){
   blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
       if(err){
           res.redirect("/secret");
       }else{
           res.redirect("/blogs/" + req.params.id); 
       }
   }); 
}); 

//DELETE ROUTE
router.delete("/blogs/:id",checkblogownership,function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/secret");
        }
    });
   
}); 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
function checkblogownership(req,res,next){
    if(req.isAuthenticated()){
        blog.findById(req.params.id,function(err,foundblog){
            if(err){
                res.redirect("back");
            }else{
                if(foundblog.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
  
}
module.exports=router;