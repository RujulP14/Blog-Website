const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");
const app=express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/Blog", {
    useNewUrlParser: true
});
const userSchema={
    firstName : String,
    lastName: String,
    userName: String,
    password: String,
};
const postSchema={
    title: String,
    body: String,
    user: String
};
const postArray=[]
const userArray=[];
const Post=mongoose.model("Post",postSchema);
const User=mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
});
app.get("/compose",function(req,res){
    res.render("compose");
});
app.get("/about",function(req,res){
    res.render("about");
});
app.get("/profile",function(req,res){
    res.render("profile");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/blogs",function(req,res){
    console.log(postArray);
    res.render("blog",{
        posts:postArray
    });
})
app.get("/users",function(req,res){
    res.render("user");
})
app.post("/blogs",function(req,res){
    if(postArray.length==0){
        res.send("NO BLOGS AVALAIBLE");
    }else{
        res.redirect("blogs");
    }
})
app.post("/compose",function(req,res){
    const username=req.body.userName;
    const title=req.body.postTitle;
    const body=req.body.postBody;
    console.log(username,title,body);
    const blog=new Post({
        title:title,
        body:body,
        user:username
    });
    blog.save();
    postArray.push(blog);
    console.log(postArray);
    res.redirect("/");
});

app.post("/users",function(req,res){
    const user=req.body.user;
    Post.find({userName: user},function(err,foundUser){
        if(!foundUser){
            res.send("No post from that user");
        }
        else{
            console.log(foundUser);
            res.redirect("/blog/"+foundUser[0].user);
        }
    })
})

// For registering new users

app.post("/register",function(req,res){
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const username=req.body.username;
    const password=req.body.password;
    console.log(firstname,lastname,username,password);
    User.exists({userName: username},function(err,result){
        if(err){
            console.log(err);
        }else{
            if(result){
                console.log("Already exists");
                res.redirect("/register");
            }else{
                const user=new User({
                    firstName: firstname,
                    lastName: lastname,
                    userName: username,
                    password: password
                });
                user.save();
                res.redirect("/");
            }
        }
    });
});

// For logging in users

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({
        userName: username
    },function(err,foundUser){
        console.log(foundUser);
        if(foundUser===null){
            res.redirect("/login");
        }else{
            const foundPassword=foundUser.password;
            if(foundPassword==password){
                res.redirect("/");
            }else{
                res.redirect("login");
            }
        }

    });
    console.log(username,password);
});

//Making server port
app.listen(3000,function(req,res){
    console.log("Server Started!");
});
