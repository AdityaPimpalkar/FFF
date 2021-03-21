import Stripe from "stripe";
// const stripe = require("stripe")(
//   "sk_test_51IWyctSEaikE1oSHzISuxMXJjSy8xfGkQxZdKWVzyKkmxTdVi03KxNeWcBoIwPqVbqVZCjWSKiKQPkXpIttp7YBX00StshXH10"
// );
const stripe = new Stripe(
  "sk_test_51IWyctSEaikE1oSHzISuxMXJjSy8xfGkQxZdKWVzyKkmxTdVi03KxNeWcBoIwPqVbqVZCjWSKiKQPkXpIttp7YBX00StshXH10",
  {
    apiVersion: "2020-08-27",
  }
);
import express, { Request, Response } from "express";
import auth from "../middleware/auth";
const router = express.Router();
import paymentModel from "../models/payment";

const { Payment, validate } = paymentModel;

const YOUR_DOMAIN = "http://localhost:8887/checkout";

router.post("/checkout", async (req: Request, res: Response) => {
  const orderObj = req.body;
  const { card } = orderObj.paymentby.selectedpayment;
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: "4242424242424242",
      exp_month: 12,
      exp_year: 28,
      cvc: "348",
    },
  });

  try {
    const payment = await stripe.paymentIntents.create({
      amount: 1222,
      currency: "INR",
      description: "FFF-Test",
      payment_method: paymentMethod.id,
      confirm: true,
    });
    console.log("Payment", payment);
    res.send(payment);
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/", auth, async (req: Request, res: Response) => {
  const Payments = await Payment.findOne()
    .where("UserId")
    .equals(req.body.user._id)
    .select({ Cards: 1, _id: 0 })
    .select("Cards.name Cards.number Cards.brand -_id");

  Payments ? res.send(Payments) : res.send({ Cards: [] });
});

router.post("/", auth, async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  if (req.body._id) {
    const Payments = await Payment.findOneAndUpdate(
      { "Cards._id": req.body._id },
      {
        $set: {
          "Cards.$.cvc": req.body.cvc,
          "Cards.$.expiry": req.body.expiry,
          "Cards.$.name": req.body.name,
          "Cards.$.number": req.body.number,
          "Cards.$.brand": req.body.brand,
        },
      },
      { new: true }
    ).exec();

    if (!Payments)
      return res.status(404).send("Could not find the card details");
    res.send(Payments);
  } else {
    const Payments = await Payment.findOneAndUpdate(
      { UserId: req.body.user._id },
      {
        $push: { Cards: req.body },
      },
      { new: true }
    ).exec();

    if (!Payments) return res.status(500).send("Error adding card details.");
    res.send(Payments);
  }
});

router.delete("/:id", auth, async (req: Request, res: Response) => {
  const Payments = await Payment.findOneAndUpdate(
    { UserId: req.body.user._id },
    { $pull: { Cards: { _id: req.params.id } } },
    { new: true }
  ).exec();

  if (!Payments) return res.status(404).send("Card does not exists.");

  res.send(Payments);
});

export default router;
