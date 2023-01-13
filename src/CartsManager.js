import fs from "fs";
export default class CartsManager {
  constructor() {
    this.id = 0;
    this.path = "src/carts.json";
  }

  async addCart() {
    const json = await this.getCarts();
    if (json.error) {
      return json;
    } else {
      let id = json.carts.length + 1;
      const idFinded = json.carts.find((cart) => cart.id === id);
      if (id === idFinded?.id) id++;
      const newCart = {id, products: []};
      json.carts.push(newCart);
      return await this.writeFile(json);
    }
  }

  async getCarts() {
    try {
      const document = await fs.promises.readFile(this.path);
      const json = JSON.parse(document);
      return json;
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async getCartById(id) {
    const json = await this.getCarts();
    if (json.error) {
      return json;
    } else {
      const cartExist = json.carts.find((cart) => cart.id === id);
      if (cartExist) {
        return cartExist;
      } else {
        return {status: 404, error: "Not found a cart with this id"};
      }
    }
  }

  async addProductToCart(cid, pid) {
    const json = await this.getCarts();
    const cart = await this.getCartById(cid);
    if (json.error || cart.error) {
      return json || cart;
    } else {
      const cartIndex = json.carts.findIndex((cart) => cart.id === cid);
      const product = cart.products.find(
        (product) => product.productId === pid
      );
      if (product) {
        const productIndex = cart.products.findIndex(
          (product) => product.productId === pid
        );
        product.quantity++;
        json.carts[cartIndex].products.splice(productIndex, 1, product);
        return await this.writeFile(json);
      } else {
        json.carts[cartIndex].products.push({productId: pid, quantity: 1});
        return await this.writeFile(json);
      }
    }
  }

  async writeFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data));
      return {status: "Ok", message: "Added successfully"};
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of write the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }
}
