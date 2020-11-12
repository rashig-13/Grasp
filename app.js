var bodyparser=require("body-parser"),
   // methodoverride=require("method-override"),
  // expresssanitizer=require("express-sanitizer");
    mongoose  =require("mongoose"),
    methodoverride=require("method-override"),
    passport=require("passport"),
    passportlocal=require("passport-local"),
    nodemailer=require("nodemailer"),
    passportlocalmongoose=require("passport-local-mongoose"),
    flash=require("connect-flash"),
    express   =require("express"),
    user=require("./models/user"),
    comment=require("./models/comment"),
    blog=require("./models/blog"),
    app=express();

var commentroutes=require("./routes/comments"),
    blogroutes=require("./routes/blogs"),
    indexroutes=require("./routes/index");                                            

mongoose.connect("mongodb://localhost/project",{useNewUrlParser:true,useUnifiedTopology:true});
//const url="mongodb://localhost/project";
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(require("express-session")({
    secret:"sirius is the brightest star",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


app.use(methodoverride("_method"));
app.use(indexroutes);
app.use(blogroutes);
app.use(commentroutes);


//////////////////////////////////////////////////////////////////////////

// app.post('/confirmation', userController.confirmationPost);
// app.post('/resend', userController.resendTokenPost);


/////////////////////////////////////////////////////////////////////////

// let db;
//app.use(methodoverride("_method"));
// blog.create({
//       title:"Why no one knows how to play Minesweeper.",
//       image:"https://miro.medium.com/max/1500/1*bvsYazxW01QazHNpHWUGyA.jpeg",
//       content:"Unlike many games and features built by corporations today, Minesweeper was built during a time where developers and computer scientists were largely hobbyists at heart. The first iterations of Minesweeper as we know it was built by Robert Donner who was hired by Microsoft in 1989. Originally a programming exercise by Donner, it’s now one of the most iconic computer games next to the likes of Pong and Tetris."
// },{
//     title:"I had no idea how to write code two years ago. Now I’m an AI engineer.",
//     image:"https://miro.medium.com/max/6050/0*zd8ohF3R8VNtiOKx",
//     content:"Two years ago, I graduated college where I studied Economics and Finance. I was all set for a career in finance. Investment Banking and Global Markets — those were the dream jobs. 9 months before graduation, I snagged a role at an investment bank, feeling proud because it was typically hard to get a role if one hadn’t interned at that bank before.,Two years ago, I graduated college where I studied Economics and Finance. I was all set for a career in finance. Investment Banking and Global Markets — those were the dream jobs. 9 months before graduation, I snagged a role at an investment bank, feeling proud because it was typically hard to get a role if one hadn’t interned at that bank before."
// },{
//     title:"Learning Python: from beginner to first app in 1 month",
//     image:"https://miro.medium.com/max/1350/1*oLavpTDxVm-_ADN9_Wi60A.png",
//     content:"I’ve spent the last month learning Python."

// },function(err,blog){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(blog);
//     }
// });

// MongoClient.connect(url, (err, database) => {
//     if(err) {
//       return console.log(err);
//     }
//     db = database;
//     // start the express web server listening on 8080
//     app.listen(8080, () => {
//       console.log('listening on 8080');
//     });
//   });
  

// MongoClient.connect(url, (err, database) => {
//     if(err) {
//       return console.log(err);
//     }
//     db = database;
//     // start the express web server listening on 8080
//     // app.listen(8080, () => {
//     //   console.log('listening on 8080');
//     // });
//   });

//   app.post('/clicked', (req, res) => {
//     const click = {clickTime: new Date()};
//     console.log(click);
//     // console.log(db);
  
//     db.collection('clicks').save(click, (err, result) => {
//       if (err) {
//         return console.log(err);
//       }
//       console.log('click added to db');
//       res.sendStatus(201);
//     });
//   });
  
//   // get the click data from the database
//   app.get('/clicks', (req, res) => {
//     db.collection('clicks').find().toArray((err, result) => {
//       if (err) return console.log(err);
//       res.send(result);
//     });
//   });
  

app.listen(3000,function(){
    console.log("server has started");
});