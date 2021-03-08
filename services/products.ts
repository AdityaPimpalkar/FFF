import productModel from "../models/product";

const { Product } = productModel;

export async function getProducts() {
  const products = await Product.find().select("name img price -_id");
  // .select({ Products: 1 })
  // .select("Products.name Products.desc Products.img Products.price -_id");

  console.log(products);
  return products;
}
