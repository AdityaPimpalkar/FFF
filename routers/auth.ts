import express, { Request, Response } from "express";
import auth from "../middleware/auth";

const router = express.Router();

import { User, validate } from "../models/user";

import address from "../models/address";
const { Address } = address;

import cart from "../models/cart";
const { Cart } = cart;

import payment from "../models/payment";
const { Payment } = payment;

router.get("/", auth, async (req: Request, res: Response) => {
  let user = await User.findOne({ email: req.body.user.email });
  if (user) {
    const token = user.generateAuthToken();
    return res.send(token);
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = user.generateAuthToken();
    return res.send(token);
  }

  const { givenName, familyName, imageUrl, email, name } = req.body;
  user = new User({
    givenName,
    familyName,
    imageUrl,
    email,
    name,
  });
  await user.save();

  await new Address({
    UserId: user._id,
    Addresses: [],
  }).save();

  await new Cart({
    UserId: user._id,
    Products: [],
  }).save();

  await new Payment({
    UserId: user._id,
    Cards: [],
  }).save();

  const token = user.generateAuthToken();
  res.send(token);
});

export default router;
