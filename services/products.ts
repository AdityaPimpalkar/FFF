import productModel from "../models/product";

const { Product } = productModel;

export async function getProducts() {
  const products = await Product.find().select("name img price _id");
  return products;
}
