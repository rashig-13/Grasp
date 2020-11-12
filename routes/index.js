var express=require("express");
var router=express.Router();
var passport=require("passport");
var user=require("../models/user");
var blog=require("../models/blog");
var async=require("async");
var nodemailer=require("nodemailer");
var flash=require("connect-flash");
var crypto=require("crypto");



router.get("/",function(req,res){
    res.render("home");
});
router.get("/signup",function(req,res){
    res.render("signup");
});
router.post("/signup",function(req,res){
 
  
 if(req.body.password === req.body.confirm){
    user.register(new user({username:req.body.username,email:req.body.email}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req,res,function(){
            // res.redirect("/secret");
            async.waterfall([
              function(done) {
                crypto.randomBytes(20, function(err, buf) {
                  var verifyToken = buf.toString('hex');
                  done(err, verifyToken);
                });
              },
              function(verifyToken, done) {
          
                  user.verifyToken = verifyToken;
                  user.verifyExpires = Date.now() + 3600000; // 1 hour
          
                  user.save(function(err) {
                    done(err,verifyToken, user);
                  });
                },
              function(verifyToken, user, done) {
                var smtpTransport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                  auth: {
                    user: 'gupta.rashi130999@gmail.com',
                    pass: 'rashi@gmail'
                  }
                });
                var mailOptions = {
                  to: user.email,
                  from: 'gupta.rashi130999@gmail.com',
                  subject: 'Node.js Password Reset',
                  text: 'Almost done,'+user.username+'! To complete your Grasp sign up,we just need to verify your email address.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/verify/' + verifyToken + '\n\n' +
                  'Once verified,you can start exploring Grasp.\n\n\n'+
                  'You are receiving this email because you recently created a new Grasp account.If you did not request this, please ignore this email.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                  console.log('mail sent');
                  req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                  done(err, 'done');
                });
              }
            ], function(err) {
              if (err) return next(err);
              res.redirect('/');
            });


        });
    });
    res.render("emailver.ejs",{user:user});
  }
  else{
    req.flash("error", "Passwords do not match.");
    return res.redirect('back');
  }
});



router.get("/verify/:verifyToken",function(req,res)
{ const User= user.findOne({ secretToken: req.params.verifyToken }, function(err, user) {
  if (!User) {
    console.log("falseee");
        req.flash('error', 'No user found');
    return res.redirect('/signup');
  }

  User.isVerified=true;
  

  req.flash("success","Successfully Registered");
  res.redirect("/login");
});
  
})

router.get("/login",function(req,res){
    res.render("login");
    // const User= user.findOne({ secretToken: req.params.verifyToken }, function(err, user) {
    //   if (!User) {
    //     console.log("falseee");
    //         req.flash('error', "Not verified");
    //     return res.redirect('/signup');
    //   }
    
    //   User.isVerified=true;
      
    
    //   req.flash("success","Successfully Registered");
    //   res.redirect("/login");
    // });
});
//middleware
router.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login",
    failureFlash: true,
    successFlash: 'Welcome to GRASP!'
}),function(req,res){

});
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!")
    res.redirect("/");
});

//forgot password


router.get("/forgot",function(req,res){
    res.render("forgot.ejs")
})
router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        user.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
          auth: {
            user: 'gupta.rashi130999@gmail.com',
            pass: 'rashi@gmail'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'gupta.rashi130999@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
          auth: {
            user: 'gupta.rashi130999@gmail.com',
            pass: 'rashi@gmail'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'gupta.rashi130999@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/secret');
    });
  });

  //user profile
  //not implemented through locus
  //use locus val(locus)
router.get("/users/:id",function(req,res){
  user.findById(req.params.id,function(err,founduser){
    if(err){
      req.flash("error","Something, went wrong");
      res.redirect("/");
    }
    blog.find().where('author.id').equals(founduser._id).exec(function(err,blogs){
      if(err){
        req.flash("error","Something, went wrong");
        res.redirect("/");
      }
      res.render("userProfile.ejs",{user:founduser,blogs:blogs});
    })
   
  })
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First")
    res.redirect("/login");
}
module.exports=router;