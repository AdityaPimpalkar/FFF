import express, { Request, Response } from "express";
const router = express.Router();
import { getProducts } from "../services/products";

router.get("/", async (req: Request, res: Response) => {
  const products = await getProducts();
  res.send(products);
});

export default router;
