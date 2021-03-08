import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: String,
  name: String,
  desc: String,
  img: String,
  price: Number,
});

const Product = mongoose.model("product", productSchema);

export default {
  Product,
};
