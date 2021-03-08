import mongoose from "mongoose";
import Joi from "joi";

const cartSchema = new mongoose.Schema({
  UserId: mongoose.Schema.Types.ObjectId,
  Products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      selectedItems: Number,
    },
  ],
});

const Cart = mongoose.model("cart", cartSchema);

const validateCart = (cart: object) => {
  const schema = Joi.object({
    UserId: Joi.string().required(),
    Products: Joi.array()
      .required()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          selectedItems: Joi.number().required(),
        })
      ),
  });
  return schema.validate(cart);
};

export default {
  Cart,
  validate: validateCart,
};
