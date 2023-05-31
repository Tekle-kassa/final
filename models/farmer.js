const mongoose = require("mongoose");
const passportLocalMongoose=require('passport-local-mongoose') 
const Schema = mongoose.Schema;
const FarmerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  location:{
    type:String
  },
  // password:{
  //   type:String
  // },
  products:[
    {
      type:Schema.Types.ObjectId,
      ref:'Product'
    }
  ]
});
FarmerSchema.plugin(passportLocalMongoose)//this will add username and password to the FarmerSchema

const Farmer=mongoose.model('Farmer',FarmerSchema)
module.exports=Farmer
