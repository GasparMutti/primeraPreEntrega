import {throws} from "assert";
import fs from "fs";
export default class ProductManager {
  constructor() {
    this.id = 0;
    this.path = "src/products.json";
  }

  async getProducts(limit) {
    try {
      const document = await fs.promises.readFile(this.path);
      const json = JSON.parse(document);
      if (limit) {
        if (limit <= json.products.length) json.products.length = limit;
        return json;
      } else {
        return json;
      }
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async addProduct(product) {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails,
    } = product;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnails ||
      !code ||
      !stock ||
      !status ||
      !category
    ) {
      return {status: 400, error: "Missing values in the request"};
    } else {
      const json = await this.getProducts();
      if (json.error) {
        return json;
      } else {
        this.id++;
        const product = {
          title,
          description,
          price,
          thumbnails,
          code,
          stock,
          id: this.id,
        };
        const exist = json.products.find(
          (prod) => prod.id === product.id || prod.code === product.code
        );
        if (exist) {
          return {
            status: 400,
            error: "Already exist a product with this params",
          };
        } else {
          json.products.push(product);
          await this.writeFile(json);
          return {status: "Ok", message: "Product added successfully"};
        }
      }
    }
  }

  async getProductById(id) {
    const json = await this.getProducts();
    if (json.error) {
      return json;
    }
    const product = json.products.find((prod) => prod.id === id);
    if (product) {
      return product;
    } else {
      return {
        status: 404,
        error: "Not found a product with this id",
      };
    }
  }

  async updateProduct(id, object) {
    if (!id || !object) {
      return {status: 400, error: "Missing values in the request"};
    } else if (object.id) {
      return {status: 400, error: "Isn't possible change the id of a product"};
    } else {
      const json = await this.getProducts();
      if (json.error) {
        return json;
      } else {
        const product = json.products.find((product) => product.id === id);
        if (product) {
          const productIndex = json.products.findIndex(
            (product) => product.id === id
          );
          const newProduct = {...product, ...object};
          json.products.splice(productIndex, 1, newProduct);
          await this.writeFile(json);
          return {status: "Ok", message: "Product updated successfully"};
        } else {
          return {status: "404", error: "Not found a product with this id"};
        }
      }
    }
  }

  async deleteProduct(id) {
    if (!id) {
      return {status: 400, error: "Missing values in the request"};
    } else {
      const json = await this.getProducts();
      if (json.error) {
        return json;
      } else {
        const product = json.products.find((product) => product.id === id);
        if (product) {
          const productIndex = json.products.findIndex(
            (product) => product.id === id
          );
          json.products.splice(productIndex, 1);
          await this.writeFile(json);
          return {status: "Ok", message: "Product deleted successfully"};
        } else {
          return {status: 404, error: "Not found a product with this id"};
        }
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
