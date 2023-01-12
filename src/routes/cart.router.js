import {Router} from "express";
import fs from "fs";

const router = Router();

router.post("/api/carts", async (req, res) => {
  const document = await fs.promises.readFile("./carts.json");
  const carts = JSON.parse(document);
  const id = Date.now();
  const products = [];
  const newCart = {
    id,
    products,
  };
  carts.carts.push(newCart);
  await fs.promises.writeFile("./carts.json", JSON.stringify(carts));
  res.send({status: "ok", message: `Cart created successfully with id ${id}`});
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
