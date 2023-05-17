const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const nodemailer = require("nodemailer");

const Farmer = require("./models/farmer");
const Product = require("./models/product");
const MarketData=require('./models/marketData')

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
app.get('/home',(req,res)=>{
  res.render('home1')
})
app.get("/addmarket", (req, res) => {
  res.render("market/addmarket");
});

// POST route to add or update market data
app.post("/addmarket", async (req, res, next) => {
  const { name, location, price } = req.body;

  try {
    // Find market data with the same product name
    let marketData = await MarketData.findOne({ name });

    if (marketData) {
      // Product already exists, check if location exists
      const existingLocation = marketData.locations.find(
        (loc) => loc.location === location
      );

      if (existingLocation) {
        // Location exists, update the price
        existingLocation.price = price;
      } else {
        // Location does not exist, add a new location with the price
        marketData.locations.push({ name:location, price });
      }
    } else {
      // Product does not exist, create a new entry
      marketData = new MarketData({
        name,
        locations: [{ name:location, price }],
      });
    }

    await marketData.save();

    res.redirect("/viewmarket");
  } catch (error) {
    next(error);
  }
});

// app.get('/viewmarket',async(req,res,next)=>{
//   const data=await MarketData.find()
//   res.render('market/viewmarket',{data})
// })
app.get('/viewmarket', async (req, res, next) => {
    const marketData = await MarketData.find();
    // console.log(marketData[0])
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
// app.post("/calculateprofit", (req, res) => {
//   const { product, location, quantity } = req.body;

//   // Retrieve the market data for the selected product and location
//   const marketData = MarketData.findOne({ name: product });

//   // Find the location within the market data
//   const selectedLocation = marketData.locations.find(loc => loc.name === location);

//   if (selectedLocation) {
//     // Calculate the profit based on the market price and the provided quantity
//     const profit = selectedLocation.price * quantity;

//     // Return the calculated profit as a JSON response
//     res.json({ profit });
//   } else {
//     // Handle the case when the selected location is not found
//     res.status(404).json({ error: "Selected location not found" });
//   }
// });


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
app.listen(3000, () => {
  console.log("listening on port 3000");
});
