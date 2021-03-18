import express, { Request, Response } from "express";
import auth from "../middleware/auth";
const router = express.Router();
import cartModel from "../models/cart";

const { Cart, validate } = cartModel;

const UserId = "603bb521117168406cdc713f";

router.get("/", auth, async (req: Request, res: Response) => {
  //const carts = await Cart.findOne().where('UserId').equals(req.params.id);

  const carts = await Cart.findOne()
    .where("UserId")
    .equals(req.body.user._id)
    .select("-_id -UserId -__v");

  res.send(carts);
});

router.post("/", auth, async (req, res) => {
  const inCart = await Cart.exists({
    UserId: req.body.user._id,
    "Products.productId": req.body._id,
  });
  if (inCart) {
    const product = {
      UserId: req.body.user._id,
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
      { UserId: req.body.user._id, "Products.productId": req.body._id },
      { $inc: { "Products.$.selectedItems": 1 } },
      { new: true }
    ).exec();
    res.send(cart);
  } else {
    const product = {
      UserId: req.body.user._id,
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
      { UserId: req.body.user._id },
      { $push: { Products: product.Products } },
      { new: true }
    ).exec();
    res.send(cart);
  }
});

router.put("/", auth, async (req, res) => {
  if (req.body.selectedItems === 1) {
    const cart = await Cart.findOneAndUpdate(
      { UserId: req.body.user._id },
      { $pull: { Products: { productId: req.body._id } } },
      { new: true }
    ).exec();

    if (!cart) return res.status(404).send("Could not remove!");
    res.send(cart);
  } else {
    const cart = await Cart.findOneAndUpdate(
      { UserId: req.body.user._id, "Products.productId": req.body._id },
      { $inc: { "Products.$.selectedItems": -1 } },
      { new: true }
    ).exec();

    if (!cart) return res.status(404).send("Could not update!");
    res.send(cart);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { UserId: req.body.user._id },
    { $pull: { Products: { productId: req.params.id } } },
    { new: true }
  ).exec();

  if (!cart) return res.status(404).send("Could not remove!");
  res.send(cart);
});

export default router;
