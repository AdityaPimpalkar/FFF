import express, { Request, Response } from "express";
const router = express.Router();
import {
  validateAddress,
  getAddresses,
  getSelectedAddress,
  updateAddress,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addresses";

router.get("/", async (req: Request, res: Response) => {
  if (req.query.getSelectedAddress) {
    const address = await getSelectedAddress();
    if (!address) return res.status(404).send("No selected address found");
    res.send(address);
  } else {
    const addresses = await getAddresses();
    if (!addresses) return res.status(404).send("No addresses found.");
    res.send(addresses);
  }
});

router.post("/", async (req: Request, res: Response) => {
  // validate request object
  const { error } = validateAddress(req);
  if (error) return res.status(404).send(error.details[0].message);

  const address = await addAddress(req);
  res.send(address);
});

router.put("/", async (req, res) => {
  // validate request object
  const { error } = validateAddress(req);
  if (error) return res.status(404).send(error.details[0].message);

  const address = await updateAddress(req);
  if (!address) return res.status(404).send("Could not update!");
  res.send(address);
});

router.put("/:id", async (req, res) => {
  const address = await setDefaultAddress(req.params.id);
  if (!address) return res.status(404).send("Could not update!");
  res.send(address);
});

router.delete("/:id", async (req, res) => {
  const address = await deleteAddress(req.params.id);
  if (!address) return res.status(404).send("Could not remove!");
  res.send(address);
});

export default router;
