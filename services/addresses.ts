import { Request } from "express";
import addressModel from "../models/address";
const { Address, validate } = addressModel;

const UserId = "603bb521117168406cdc713f";

export function validateAddress(req: Request) {
  const addressObj = {
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    landmark: req.body.landmark,
    city: req.body.city,
    pincode: req.body.pincode,
    isdefault: req.body.isdefault,
  };
  return validate(addressObj);
}

export async function getSelectedAddress() {
  let filter = {
    UserId: UserId,
  };
  let query = { Addresses: { $elemMatch: { isdefault: true } } };
  let fields = {
    Addresses: 1,
  };
  const result = await Address.findOne(filter, query).select(fields);
  return result;
}

export async function getAddresses() {
  try {
    let path = "UserId";
    let value = UserId;
    let fields = { Addresses: 1 };
    const results = await Address.findOne()
      .where(path)
      .equals(value)
      .select(fields);
    return results;
  } catch (error) {
    console.log(error);
  }
}

async function updateDefaultAddress() {
  let filter = { UserId: UserId, "Addresses.isdefault": true };
  let query = { $set: { "Addresses.$.isdefault": false } };
  let options = { new: true };
  const result = await Address.findOneAndUpdate(filter, query, options).exec();
  return result;
}

export async function setDefaultAddress(id: string) {
  let result = await updateDefaultAddress();
  if (result != null) {
    let filter = { "Addresses._id": id };
    let query = { $set: { "Addresses.$.isdefault": true } };
    let options = { new: true };
    result = await Address.findOneAndUpdate(filter, query, options).exec();
  }
  return result;
}

export async function addAddress(req: Request) {
  let result = await updateDefaultAddress();
  if (result != null) {
    let filter = { UserId: UserId };
    let query = {
      $push: {
        Addresses: {
          addressLine1: req.body.addressLine1,
          addressLine2: req.body.addressLine2,
          landmark: req.body.landmark,
          city: req.body.city,
          pincode: req.body.pincode,
          isdefault: req.body.isdefault,
        },
      },
    };
    let options = { new: true };
    result = await Address.findOneAndUpdate(filter, query, options).exec();
  }
  return result;
}

export async function updateAddress(req: Request) {
  let filter = { "Addresses._id": req.body._id };
  let query = {
    $set: {
      "Addresses.$.addressLine1": req.body.addressLine1,
      "Addresses.$.addressLine2": req.body.addressLine2,
      "Addresses.$.landmark": req.body.landmark,
      "Addresses.$.city": req.body.city,
      "Addresses.$.pincode": req.body.pincode,
      "Addresses.$.isdefault": true,
    },
  };
  let options = { new: true };
  const results = await Address.findOneAndUpdate(filter, query, options).exec();
  return results;
}

export async function deleteAddress(id: string) {
  let filter = { UserId: UserId };
  let query = { $pull: { Addresses: { _id: id } } };
  let options = { new: true };
  const results = await Address.findOneAndUpdate(filter, query, options).exec();
  return results;
}
