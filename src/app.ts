import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";

env.config({ path: "./.env" });

import users from "../routers/users";
import products from "../routers/products";
import carts from "../routers/carts";
import addresses from "../routers/addresses";
import payments from "../routers/payments";
import orders from "../routers/orders";
import auth from "../routers/auth";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", users);
app.use("/api/product", products);
app.use("/api/cart", carts);
app.use("/api/address", addresses);
app.use("/api/payment", payments);
app.use("/api/order", orders);
app.use("/api/auth", auth);

mongoose
  .connect(process.env.DB_CONNECTION!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to mongodb...");
  })
  .catch((err) => {
    console.error("connection to mongodb failed..");
  });

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}...`)
);
