// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const productSchema=new Schema({
//     // name:{
//     //     type:String,
//     //     required:true
//     // },
//     // amount:{
//     //     type:Number,
//     //     required:true
//     // },
//     // price:{
//     //     type:Number,
//     //     required:true

//     // },
//     // owner:{
//     //     type:Schema.Types.ObjectId,
//     //     ref:'Farmer'
//     // }
//     name:{
//         type:String,
//         enum:['teff','wheat','onion','barley','potato'],
//         required:true
//     },
//     owner:{
//         type:Schema.Types.ObjectId,
//         ref:'Farmer'
//     }
// })
// const Product=mongoose.model('Product',productSchema)
// module.exports=Product

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const marketData = require("./marketData");

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  farmer: {
    type: Schema.Types.ObjectId,
    ref: "Farmer",
    // required: true,
  },
});
ProductSchema.methods.calculateProfit = async function (sellAmount) {
  const product = this;
  const data = await marketData.findOne({ productName: product.name });
  if (!data) {
    throw new Error("Market data not found for the product");
  }
  const price = data.price;
  const profit = price * sellAmount;
  return profit;
};
ProductSchema.methods.calculateRemainingQuantity = function (sellAmount) {
  const product = this;
  return (product.quantity -= sellAmount);
};
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
