import express, { Request, Response } from "express";
import auth from "../middleware/auth";
const router = express.Router();
import {
  validateAddress,
  getAddresses,
  updateAddress,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addresses";

router.get("/", auth, async (req: Request, res: Response) => {
  const addresses = await getAddresses(req);
  if (!addresses) return res.status(404).send("No addresses found.");
  res.send(addresses);
});

router.post("/", auth, async (req: Request, res: Response) => {
  // validate request object
  const { error } = validateAddress(req);
  if (error) return res.status(404).send(error.details[0].message);

  const address = await addAddress(req);
  res.send(address);
});

router.put("/", auth, async (req: Request, res: Response) => {
  // validate request object
  const { error } = validateAddress(req);
  if (error) return res.status(404).send(error.details[0].message);

  const address = await updateAddress(req);
  if (!address) return res.status(404).send("Could not update!");
  res.send(address);
});

router.put("/:id", auth, async (req: Request, res: Response) => {
  const address = await setDefaultAddress(req);
  if (!address) return res.status(404).send("Could not update!");
  res.send(address);
});

router.delete("/:id", auth, async (req: Request, res: Response) => {
  const address = await deleteAddress(req);
  if (!address) return res.status(404).send("Could not remove!");
  res.send(address);
});

export default router;
