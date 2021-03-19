import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { IUser, UserDoc, UserModelInterface } from "../template/IUser";

const JwtPrivateKey = process.env.JwtPrivateKey;

const userSchema = new Schema<UserDoc>({
  givenName: { type: String, min: 5, max: 255, required: true },
  familyName: { type: String, min: 5, max: 255, required: true },
  name: { type: String, min: 5, max: 255, required: true },
  email: { type: String, min: 10, max: 255, required: true, unique: true },
  imageUrl: { type: String, required: true, unique: true },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    JwtPrivateKey!
  );
  return token;
};

userSchema.methods.createDocument = (user: IUser) => {
  return new User(user);
};

const User = mongoose.model<UserDoc, UserModelInterface>("user", userSchema);

function validateUser(userObj: Object) {
  const schema = Joi.object({
    givenName: Joi.string().required().min(5).max(255),
    familyName: Joi.string().required().min(5).max(255),
    name: Joi.string().required().min(5).max(255),
    email: Joi.string().required().email().min(10).max(255),
    imageUrl: Joi.string().required(),
  });
  return schema.validate(userObj);
}

export { User, validateUser as validate };
