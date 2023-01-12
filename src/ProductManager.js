import fs from "fs";
export default class ProductManager {
  constructor() {
    this.id = 0;
    this.path = "./products.json";
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
      const response = await this.getProducts();
      if (response.error) {
        return response;
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
        const exist = response.products.find(
          (prod) => prod.id === product.id || prod.code === product.code
        );
        if (exist) {
          return {
            status: 400,
            error: "Already exist a product with this params",
          };
        } else {
          response.products.push(product);
          await fs.promises.writeFile(this.path, JSON.stringify(response));
          return {status: "Ok", message: "Product added successfully"};
        }
      }
    }
  }

  async getProducts(limit) {
    try {
      const document = await fs.promises.readFile(this.path);
      const documentJson = JSON.parse(document);
      if (limit) {
        return documentJson.products.splice(0, limit);
      } else {
        return documentJson;
      }
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async getProductById(id) {
    const response = await this.getProducts();
    if (response.error) {
      return response;
    }
    const productFinded = response.products.find((prod) => prod.id === id);
    if (productFinded) {
      return productFinded;
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
      const response = await this.getProducts();
      if (response.error) {
        return response;
      } else {
        const productFinded = response.products.find(
          (product) => product.id === id
        );
        if (productFinded) {
          let productIndex = response.products.findIndex(
            (product) => product.id === id
          );
          const newProduct = {...productFinded, ...object};
          response.products.splice(productIndex, 1, newProduct);
          await fs.promises.writeFile(this.path, JSON.stringify(response));
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
      const response = await this.getProducts();
      if (response.error) {
        return response;
      } else {
        const productFinded = response.products.find(
          (product) => product.id === id
        );
        if (productFinded) {
          const productIndex = response.products.findIndex(
            (product) => product.id === id
          );
          response.products.splice(productIndex, 1);
          await fs.promises.writeFile(this.path, JSON.stringify(response));
          return {status: "Ok", message: "Product deleted successfully"};
        } else {
          return {status: 404, error: "Not found a product with this id"};
        }
      }
    }
  }
}
