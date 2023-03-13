//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const home = "Welcome to Journo,a free personal diary site to record your daily thoughts.";
const about = " Hey there! I am Abhay Naidu,Student from IITG";
const contact = "a.naidu@iitg.ac.in";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

if (mongoose.connect("mongodb+srv://naiduabhay1:naiduabhay1107@diarycluster.ic3uetd.mongodb.net/user")) {
    
};





var user = [];
var pwd = [];

const userschema = {
    username: String,
    Password: String
};
const User = new mongoose.model('detail', userschema)

var current_user = ''

app.get("/", (req, res) => {
    res.render("landing");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/signup", (req, res) => {
    res.render("signup");
})

const blogschema = {
    currentuser: String,
    title: [String],
    content: [String]

}
const Content = new mongoose.model('blog', blogschema);


app.get("/:id", (req, res) => {
    var siteName = req.params['id'];



    if (current_user === '') {
        res.redirect("/");

    }
    else {
        if (siteName === "home") {
            res.render("home", { homeconte: home, cur_user: current_user });
        }
        else if (siteName === "about") {
            res.render("about", { homeconte: about, cur_user: current_user });
        }
        else if (siteName === "contact") {
            res.render("contact", { homeconte: contact, cur_user: current_user });
        }
        else if (siteName === "compose") {
            res.render("compose", { cur_user: current_user });
        }
    }




})

app.post("/login", (req, res) => {
    var usr = req.body.username;
    var passwd = req.body.password;
    User.findOne({ username: usr }).then(foundu => {

        if (foundu) {
            if (foundu.Password === passwd) {


                res.redirect("/home");
                current_user = usr;
                console.log(current_user);
            } else {
                res.redirect("/login");
                console.log(3);
            }
        }
        else {
            res.redirect("/signup");
            console.log(4);

        }

    })


})

app.post("/signup", async (req, res) => {

    var new_usr = req.body.new_username;
    var new_passwd = req.body.new_password;
    var new_conpasswd = req.body.confpassword;

    if (new_passwd === new_conpasswd) {

        const newUser = new User({
            username: new_usr,
            Password: new_passwd
        })
        if (await newUser.save()) {
            current_user = new_usr;


            res.redirect("/home")

        }
        else {
            console.log(0);
        }

        user.push(new_usr);
        pwd.push(new_passwd);
        console.log(current_user);


    }
    else {
        res.redirect("/signup");
        console.log("Pwd not match");
    }

})


app.post("/compose", async (req, res) => {



    var inb = req.body.inpblog
    var inbt = req.body.inpblogtit
    console.log(xo);
    Content.findOne({ currentuser: current_user }).then(found => {
        if (found) {
            found.title.push(inbt);
            found.content.push(inb);
            // xo=blogt;
            // y=blogc;
            found.save();
            res.redirect("/compose/blog");
            console.log(49);

        }
        else {
            var blogt = [];
            var blogc = [];
            blogt.push(inbt)
            blogc.push(inb);
            const new_blog = new Content({
                currentuser: current_user,
                title: blogt,
                content: blogc
        
            });
            
            new_blog.save();
            console.log(69);
        }




    })

    
    

})

app.get("/compose/blog", (req, res) => {
    if (current_user === '') {
        res.redirect("/");

    }
    else {
        Content.findOne({ currentuser: current_user }).then(found => {
            if (found) {
                var blogtitle = found.title;
                var blogcontent = found.content;
                
                res.render("post", { homeconte: blogcontent, homcont: blogtitle, cur_user: current_user });

            }
            else {
                res.redirect("/compose");
            }



        })
    }

})



app.post("/logout", (req, res) => {
    res.redirect("/");
    current_user = ''
    


})










app.listen(3000, function () {
    console.log("start");
})

