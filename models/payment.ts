import mongoose from "mongoose";
import Joi from "joi";

const paymentSchema = new mongoose.Schema({
  UserId: mongoose.Schema.Types.ObjectId,
  Cards: [
    {
      cvc: String,
      expiry: String,
      name: String,
      number: String,
      brand: String,
    },
  ],
});

const Payment = mongoose.model("payment", paymentSchema);

const validatePayment = (payment: object) => {
  const schema = Joi.object({
    _id: Joi.string().optional().allow(),
    cvc: Joi.string().required(),
    expiry: Joi.string().required(),
    name: Joi.string().required(),
    number: Joi.string().min(13).required(),
    brand: Joi.string().required(),
  });
  return schema.validate(payment);
};

export default {
  Payment,
  validate: validatePayment,
};
