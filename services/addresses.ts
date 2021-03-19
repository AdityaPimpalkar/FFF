import { Request } from "express";
import addressModel from "../models/address";
const { Address, validate } = addressModel;

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

async function getSelectedAddress(req: Request) {
  let filter = {
    UserId: req.body.user._id,
  };
  let query = { Addresses: { $elemMatch: { isdefault: true } } };
  let fields = {
    Addresses: 1,
    _id: 0,
  };
  const result = await Address.findOne(filter, query).select(fields);
  return result;
}

export async function getAddresses(req: Request) {
  if (req.query.getSelectedAddress) {
    const result = await getSelectedAddress(req);
    return result;
  } else {
    try {
      let path = "UserId";
      let value = req.body.user._id;
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
}

async function updateDefaultAddress(req: Request) {
  let filter = { UserId: req.body.user._id, "Addresses.isdefault": true };
  let query = { $set: { "Addresses.$.isdefault": false } };
  let options = { new: true };
  const result = await Address.findOneAndUpdate(filter, query, options).exec();
  return result;
}

export async function setDefaultAddress(req: Request) {
  let result = await updateDefaultAddress(req);
  if (result != null) {
    let filter = { "Addresses._id": req.params.id };
    let query = { $set: { "Addresses.$.isdefault": true } };
    let options = { new: true };
    result = await Address.findOneAndUpdate(filter, query, options).exec();
  }
  return result;
}

export async function addAddress(req: Request) {
  let result = await updateDefaultAddress(req);
  if (result != null) {
    let filter = { UserId: req.body.user._id };
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

export async function deleteAddress(req: Request) {
  let filter = { UserId: req.body.user._id };
  let query = { $pull: { Addresses: { _id: req.params.id } } };
  let options = { new: true };
  const results = await Address.findOneAndUpdate(filter, query, options).exec();
  return results;
}
