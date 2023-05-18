const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const nodemailer = require("nodemailer");

const Farmer = require("./models/farmer");
const Product = require("./models/product");
const MarketData=require('./models/marketData')
const Post=require('./models/post')

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
  res.render("home1");
});
app.get('/home',(req,res)=>{
  res.render('home1')
})
app.get("/addmarket", (req, res) => {
  res.render("market/addmarket");
});
app.post("/addmarket", async (req, res, next) => {
  const { name, location, price } = req.body;
    let marketData = await MarketData.findOne({ name });
    if (marketData) {
      const existingLocation = marketData.locations.find(
        (loc) => loc.location === location
      );

      if (existingLocation) {
        existingLocation.price = price;
      } else {
        marketData.locations.push({ name:location, price });
      }
    } else {
      marketData = new MarketData({
        name,
        locations: [{ name:location, price }],
      });
    }

    await marketData.save();

    res.redirect("/viewmarket");
  
});
app.get('/viewmarket', async (req, res, next) => {
    const marketData = await MarketData.find();
    res.render('market/viewmarket', { data: marketData });
});
app.post('/calculateProfit',async(req,res,next)=>{
  const { product, location, quantity } = req.body;
  const marketData=await MarketData.findOne({name:product})
  const selectedLocation = marketData.locations.find(loc => loc.name === location);
  if (selectedLocation) {
    // Calculate the profit based on the market price and the provided quantity
    const profit = selectedLocation.price * quantity;
    res.render("market/profit", { product, location, quantity, profit });
  }

})
app.get("/farmer/signup", (req, res, next) => {
  res.render("farmer/signup");
});
app.post("/farmer/signup", async (req, res, next) => {
  const farmer = new Farmer(req.body);
  await farmer.save();
  // console.log(farmer)
  res.redirect("/farmer/products");
});

app.get("/farmer/products", async (req, res, next) => {
  const products = await Product.find();
  res.render("farmer/products", { products });
});
app.post("/farmer/products", async (req, res, next) => {
  const product = new Product(req.body);
  await product.save();
  res.redirect("/viewmarket");
});
// GET route to render the form for posting items
app.get('/farmer/post', (req, res) => {
  res.render('postItem'); // Render the form view for posting items
});

// POST route to handle the submission of posted items
app.post('/farmer/post', (req, res) => {
  // Retrieve the form data submitted by the farmer
  const { itemName, description, quantity, price, contactInfo, deliveryOptions } = req.body;
  
  // Process the data and save it to a database or perform any required actions
  // ...

  // Redirect the farmer to a confirmation page or back to the form
  res.redirect('/farmer/posted');
});

// GET route to display the confirmation page after posting an item
app.get('/farmer/posted', (req, res) => {
  res.render('confirmation'); // Render the confirmation view
});

app.get('/items', async (req, res) => {
  try {
    // Retrieve the posted items from the database
    const items = await Post.find().populate('farmer');

    // Pass the retrieved items to the EJS template for rendering
    res.render('items', { items });
  } catch (error) {
    // Handle any errors that occur during retrieval
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
