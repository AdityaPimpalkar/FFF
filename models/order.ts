import Joi from "joi";
import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  order_number: String,
  order_stage: Number,
  order_total: Number,
  placed_on: String,
  delivered_on: String,
  deliveryaddress: Object,
  paymentby: Schema.Types.Mixed,
  payment_status: String,
  products: Array,
});

const Order = mongoose.model("order", orderSchema);

const validateOrder = (order: Object) => {
  const schema = Joi.object({
    cart: Joi.array().allow(),
    redirect: Joi.boolean().allow(),
    grandtotal: Joi.number().required(),
    deliveryaddress: Joi.object({
      _id: Joi.string().required(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string().required(),
      landmark: Joi.string().required(),
      city: Joi.string().required(),
      pincode: Joi.string().min(5).max(6).required(),
      isdefault: Joi.boolean().required(),
    }).required(),
    paymentby: Joi.object({
      selectedpayment: Joi.alternatives().try(
        Joi.string(),
        Joi.object({
          card: Joi.object({
            _id: Joi.string().required(),
            cvc: Joi.string().required(),
            expiry: Joi.string().required(),
            name: Joi.string().required(),
            number: Joi.string().min(13).required(),
            brand: Joi.string().required(),
          }),
        })
      ),
    }).required(),
    products: Joi.array().items({
      _id: Joi.string().required(),
      type: Joi.string().required(),
      name: Joi.string().required(),
      desc: Joi.string().required(),
      img: Joi.string().required(),
      price: Joi.number().required(),
      selectedItems: Joi.number().required(),
      total: Joi.number().required(),
    }),
  });
  return schema.validate(order);
};

export default {
  Order,
  validate: validateOrder,
};
