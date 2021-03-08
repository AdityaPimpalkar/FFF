import mongoose, { Schema } from "mongoose";
import express, { Request, Response } from "express";
const router = express.Router();
import orderModel from "../models/order";
import cartModel from "../models/cart";

const { Order, validate } = orderModel;
const { Cart } = cartModel;

const UserId = "603bb521117168406cdc713f";

router.get("/", async (req: Request, res: Response) => {
  if (req.body.order_id) {
    const orders = await Order.findOne(
      { user_id: UserId },
      { order_number: req.body.order_id }
    ).exec();
    res.send(orders);
  }
  const orders = await Order.find({ user_id: UserId }).exec();
  res.send(orders);
});

router.put("/", async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const orderObj = req.body;
  const orderNumber = `ORD${Math.floor(Math.random() * 1000000000)}`;

  const order = new Order({
    user_id: UserId,
    order_number: orderNumber,
    order_stage: 1,
    order_total: orderObj.grandtotal,
    placed_on: new Date(Date.now()).toLocaleString([], { hour12: true }),
    delivered_on: "",
    deliveryaddress: orderObj.deliveryaddress,
    paymentby: orderObj.paymentby,
    payment_status:
      orderObj.paymentby.selectedpayment !== "cashondelivery"
        ? "PAID"
        : "PENDING",
    products: orderObj.products,
  });

  await order
    .save()
    .then(async (data) => {
      await Cart.findOneAndUpdate(
        { UserId: UserId },
        { $set: { Products: [] } }
      );
      res.send(orderNumber);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

export default router;
