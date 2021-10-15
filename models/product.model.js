const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema(
  {
    productName: { type: String, required: true, unique: true },
    productCategory: { type: String, required: true },
    price: { type: Number, required: true },
    productImg: { type: String, default: "" },
    ordersCreated: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;
