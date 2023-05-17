// const mongoose = require("mongoose");

// const MarketDataSchema = new mongoose.Schema({
//   productName: {
//     type: String,
//     required: true,
//   },
//   marketLocation: {
//     type: String,
//     required: true,
//   },
//   currentPrice: {
//     type: Number,
//     required: true,
//   },
// });

// const MarketData = mongoose.model("MarketData", MarketDataSchema);

// module.exports = MarketData;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarketDataSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  locations: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

const MarketData=mongoose.model("MarketData",MarketDataSchema)
module.exports=MarketData
