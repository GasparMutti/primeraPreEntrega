import {Router} from "express";
import fs from "fs";
import CartsManager from "../CartsManager.js";

const router = Router();

const cm = new CartsManager();

router.post("/api/carts", async (req, res) => {
  const response = await cm.addCart();
  if (response.error) {
    res.status(response.status).send(response);
  } else {
    res.send(response);
  }
});

router.get("/api/carts/:cid", async (req, res) => {
  const document = await fs.promises.readFile("./carts.json");
  const carts = JSON.parse(document).carts;
  const id = +req.params.cid;
  const cartIndex = carts.findIndex((cart) => cart.id === id);
  carts[cartIndex]
    ? res.send(carts[cartIndex])
    : res.status(404).send({status: "error", error: "not found"});
});

router.post("/api/carts/:cid/products/:pid", async (req, res) => {
  const document = await fs.promises.readFile("./carts.json");
  const carts = JSON.parse(document).carts;
  const cartId = +req.params.cid;
  const productId = +req.params.pid;
  const cartIndex = carts.findIndex((cart) => cart.id === cartId);
  carts[cartIndex].products.push({productId, quantity: 1});
  await fs.promises.writeFile("./carts.json", JSON.stringify(carts));
  res.send({status: "ok", message: "Product added successfully"});
});
export default router;
