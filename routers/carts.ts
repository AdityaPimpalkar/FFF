import express, { Request, Response } from "express";
const router = express.Router();
import cartModel from "../models/cart";

const { Cart, validate } = cartModel;

const UserId = "603bb521117168406cdc713f";

router.get("/", async (req: Request, res: Response) => {
  //const carts = await Cart.findOne().where('UserId').equals(req.params.id);
  const carts = await Cart.findOne().where("UserId").equals(UserId);
  res.send(carts);
});

router.post("/", async (req, res) => {
  const inCart = await Cart.exists({
    UserId: UserId,
    "Products.productId": req.body._id,
  });
  if (inCart) {
    const product = {
      UserId: UserId,
      Products: [
        {
          productId: req.body._id,
          selectedItems: 0,
        },
      ],
    };

    const { error } = validate(product);
    if (error) return res.status(400).send(error.details[0].message);

    let cart = await Cart.findOneAndUpdate(
      { UserId: UserId, "Products.productId": req.body._id },
      { $inc: { "Products.$.selectedItems": 1 } },
      { new: true }
    ).exec();
    res.send(cart);
  } else {
    const product = {
      UserId: UserId,
      Products: [
        {
          productId: req.body._id,
          selectedItems: 1,
        },
      ],
    };
    const { error } = validate(product);
    if (error) return res.status(400).send(error.details[0].message);

    let cart = await Cart.findOneAndUpdate(
      { UserId: UserId },
      { $push: { Products: product.Products } },
      { new: true }
    ).exec();
    res.send(cart);
  }
});

router.put("/", async (req, res) => {
  if (req.body.selectedItems === 1) {
    const cart = await Cart.findOneAndUpdate(
      { UserId: UserId },
      { $pull: { Products: { productId: req.body._id } } },
      { new: true }
    ).exec();

    if (!cart) return res.status(404).send("Could not remove!");
    res.send(cart);
  } else {
    const cart = await Cart.findOneAndUpdate(
      { UserId: UserId, "Products.productId": req.body._id },
      { $inc: { "Products.$.selectedItems": -1 } },
      { new: true }
    ).exec();

    if (!cart) return res.status(404).send("Could not update!");
    res.send(cart);
  }
});

router.delete("/:id", async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { UserId: UserId },
    { $pull: { Products: { productId: req.params.id } } },
    { new: true }
  ).exec();

  if (!cart) return res.status(404).send("Could not remove!");
  res.send(cart);
});

export default router;
