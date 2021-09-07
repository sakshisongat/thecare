const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const DB = 'mongodb+srv://sakshisongat:<2face3book>@cluster0.rvukv.mongodb.net/thecare?retryWrites=true&w=majority'
require("./db/conn");
const User = require("./models/usermsg");
const authenticateUser = require("../authenticateUser");
const hbs = require("hbs");

const app = express();

const port = process.env.PORT || 3300;

const staticpath = path.join(__dirname, "../public");
const viewspath = path.join(__dirname, "../templates/views");
const partialspath = path.join(__dirname, "../templates/partials");

app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static(staticpath))


app.set("view engine", "hbs");
app.set("views", viewspath)
hbs.registerPartials(partialspath);

// cookie session
app.use(
    cookieSession({
      keys: ["randomStringASyoulikehjudfsajk"],
    })
  );


app.get("/", (req, res)=>{
    res.render("index");
})
app.get("/login", (req, res) => {
    res.render("login");
  })
app.get("/register", (req, res) => {
    res.render("register");
  })

app.get("/home", authenticateUser, (req, res) => {
    res.render("home", { user: req.session.user });
  });


// route handling post
app
  .post("/login", async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits) {
      res.send("invalid username or password");
      return;
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) {
      res.send("invalid useranme or password");
      return;
    }

    // else he\s logged in
    req.session.user = {
      email,
    };

    res.redirect("/home");
  })
  .post("/register", async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExitsAlreay = await User.findOne({ email });

    if (doesUserExitsAlreay) {
      res.send("A user with that email already exits please try another one!");
      return;
    }

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ email, password: hashedPassword });

    latestUser
      .save()
      .then(() => {
        res.send("registered account!");
        return;
      })
      .catch((err) => console.log(err));
  });
  
  // auth 
  module.exports = (req, res, next) => {
    if (!req.session.user) {
      res.send("You're not allowed to view this content! please log in first!");
      return;
    }
    //else continue
    next();
  };
  
//logout
app.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});





// app.post("/submit", async(req,res)=>{
//     try {
//         // res.send(req.body);
//         const userData = new User(req.body);
//         await userData.save();
//         res.status(201).render("index");
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })
app.listen(port, () => {
    console.log(`Server running at port no ${port}`);
  });