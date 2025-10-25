import { Product, ProductStore } from "../../models/product";

const store = new ProductStore();

describe("Product Model", () => {
  let productId: number;

  beforeAll(async () => {
    const setupProduct: Product = {
      name: "Test Product",
      price: 29.99,
      category: "setup",
    };
    const created = await store.create(setupProduct);
    if (!created || created.id === undefined || created.id === null) {
      throw new Error("Setup product creation failed - no id returned");
    }
    productId = created.id as number;
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have an update method", () => {
    expect(store.update).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("create method should add a product", async () => {
    const product: Product = {
      name: `tmp_product_${Date.now()}`,
      price: 29.99,
      category: "Electronics",
    };

    const result = await store.create(product);
    const tmpId = result.id as number;

    expect(result.name).toBe(product.name);
    expect(parseFloat(result.price.toString())).toBe(29.99);
    expect(result.category).toBe("Electronics");

    // clean up temporary product
    await store.delete(tmpId.toString());
  });

  // remove the setup product after all tests
  afterAll(async () => {
    if (productId !== undefined && productId !== null) {
      await store.delete(productId.toString());
    }
  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return the correct product", async () => {
    const result = await store.show(productId.toString());
    expect(result.name).toBe("Test Product");
    expect(parseFloat(result.price.toString())).toBe(29.99);
  });

  it("update method should modify the product", async () => {
    const tmp: Product = {
      name: `update_tmp_${Date.now()}`,
      price: 10.0,
      category: "Temp",
    };
    const created = await store.create(tmp);
    const updatedProduct: Product = {
      name: "Updated Product",
      price: 39.99,
      category: "Electronics",
    };
    const result = await store.update(created.id!.toString(), updatedProduct);
    expect(result.name).toBe("Updated Product");
    expect(parseFloat(result.price.toString())).toBe(39.99);
    // cleanup
    await store.delete(created.id!.toString());
  });

  it("delete method should remove the product", async () => {
    const toDelete: Product = {
      name: `del_tmp_${Date.now()}`,
      price: 5.5,
      category: "Temp",
    };
    const created = await store.create(toDelete);
    const delResult = await store.delete(created.id!.toString());
    expect(delResult.id).toBe(created.id);
  });

  it("getByCategory method should return products in a category", async () => {
    // Create a test product first
    const product: Product = {
      name: "Category Test Product",
      price: 19.99,
      category: "TestCategory",
    };
    const created = await store.create(product);

    const result = await store.getByCategory("TestCategory");
    expect(result.length).toBeGreaterThan(0);

    // Clean up
    await store.delete(created.id!.toString());
  });
});
