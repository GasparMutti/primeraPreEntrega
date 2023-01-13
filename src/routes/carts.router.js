import {Router} from "express";
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
  const id = +req.params.cid;
  const response = await cm.getCartById(id);
  if (response.error) {
    res.status(response.status).send(response);
  } else {
    res.send(response);
  }
});

router.post("/api/carts/:cid/products/:pid", async (req, res) => {
  const cid = +req.params.cid;
  const pid = +req.params.pid;
  const response = await cm.addProductToCart(cid, pid);
  if (response.error) {
    res.status(response.status).send(response);
  } else {
    res.send(response);
  }
});
export default router;
