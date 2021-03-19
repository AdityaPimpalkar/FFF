import express, { Request, Response } from "express";
const router = express.Router();

import auth from "../middleware/auth";
import { User, validate } from "../models/user";

router.get("/", auth, async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.body.user._id })
    .select({ __v: 0, _id: 0 })
    .exec();
  if (!user) res.status(404).send("User dosent exists!");
  res.send(user);
});

router.put("/", auth, async (req: Request, res: Response) => {
  const { error } = validate(req);
  if (error) res.status(400).send(error.details[0].message);
});

export default router;
