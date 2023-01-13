import fs from "fs";
export default class CartsManager {
  constructor() {
    this.id = 0;
    this.path = "./carts.json";
  }

  async getCarts() {
    try {
      const document = await fs.promises.readFile(this.path);
      const documentJson = JSON.parse(document);
      return documentJson;
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async addCart() {
    const response = await this.getCarts();
    if (response.error) {
      return response;
    } else {
      let id = response.carts.length + 1;
      const idFinded = response.carts.find((cart) => cart.id === id);
      while (id === idFinded?.id) id++;
      const newCart = {id, products: []};
      response.carts.push(newCart);
      try {
        await fs.promises.writeFile(this.path, JSON.stringify(response));
        return {status: "Ok", message: "Cart added successfully"};
      } catch (error) {
        return {
          status: 500,
          error:
            "An error has occurred at moment of write the file, this error is from server and we're working on resolve the problem.",
        };
      }
    }
  }
}
