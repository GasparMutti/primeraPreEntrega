import express from "express";
import productsRoutes from "./routes/products.router.js";
import cartRoutes from "./routes/cart.router.js";

const server = express();

server.listen(8080, () => console.log("Servidor levantado en el puerto 8080"));

server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use(productsRoutes);
server.use(cartRoutes);
