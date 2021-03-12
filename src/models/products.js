const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  
    name: {
        type:String,
        required:true,
        unique:true
    },
   price: {
       type:Number,
       required:true
   },
   productImage: {
       type:String
      
   }
});

const Product = new mongoose.model("Product", productSchema);

module.exports= Product;