import express, { Request, Response } from "express";
const router = express.Router();
import paymentModel from "../models/payment";

const { Payment, validate } = paymentModel;

const UserId = "603bb521117168406cdc713f";

router.get("/", async (req: Request, res: Response) => {
  //const Addresses = await Payment.findOne().where('UserId').equals(req.params.id);
  const Payments = await Payment.findOne()
    .where("UserId")
    .equals(UserId)
    .select({ Cards: 1, _id: 0 })
    .select("Cards.name Cards.number Cards.brand -_id");

  Payments ? res.send(Payments) : res.send({ Cards: [] });
});

router.post("/", async (req: Request, res: Response) => {
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
      { UserId: UserId },
      {
        $push: { Cards: req.body },
      },
      { new: true }
    ).exec();

    if (!Payments) return res.status(500).send("Error adding card details.");
    res.send(Payments);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  //const Payments = await Payment.findOneAndDelete({ 'Cards._id': req.body._id }).exec();
  const Payments = await Payment.findOneAndUpdate(
    { UserId: UserId },
    { $pull: { Cards: { _id: req.params.id } } },
    { new: true }
  ).exec();

  if (!Payments) return res.status(404).send("Card does not exists.");

  res.send(Payments);
});

export default router;
