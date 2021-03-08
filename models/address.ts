import mongoose from "mongoose";
import Joi from "joi";

const addressSchema = new mongoose.Schema({
  UserId: mongoose.Schema.Types.ObjectId,
  Addresses: [
    {
      addressLine1: String,
      addressLine2: String,
      landmark: String,
      city: String,
      pincode: String,
      isdefault: false,
    },
  ],
});

const Address = mongoose.model("address", addressSchema);

const validateAddress = (address: Object) => {
  const schema = Joi.object({
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().required(),
    landmark: Joi.string().required(),
    city: Joi.string().required(),
    pincode: Joi.string().min(5).max(6).required(),
    isdefault: Joi.boolean().required(),
  });
  return schema.validate(address);
};

export default {
  Address,
  validate: validateAddress,
};
