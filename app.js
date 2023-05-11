const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

const Farmer=require('./models/farmer')

const app = express();

app.set("views", "views");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://127.0.0.1:27017/01", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("CONNECTED");
  })
  .catch((e) => {
    console.log(e.message);
  });

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/farmer/signup", (req, res) => {
  res.render("farmer/signup");
});
app.post("/farmer/signup",async (req,res,next)=>{
    const farmer=new Farmer(req.body)
    await farmer.save()
    console.log(farmer)
    res.redirect('/')
})
app.listen(3000, () => {
  console.log("listening on port 3000");
});
