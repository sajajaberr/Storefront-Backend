import { Order, OrderStore } from "../../models/order";
import { User, UserStore } from "../../models/user";
import { Product, ProductStore } from "../../models/product";

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("Order Model", () => {
  let orderId: number;
  let userId: number;
  let productId: number;

  // Setup: Create a test user and product
  beforeAll(async () => {
    const user: User = {
      username: "ordertest",
      firstname: "Order",
      lastname: "Test",
      password: "password123",
    };
    const createdUser = await userStore.create(user);
    userId = createdUser.id as number;

    const product: Product = {
      name: "Test Product for Order",
      price: 49.99,
      category: "Test",
    };
    const createdProduct = await productStore.create(product);
    productId = createdProduct.id as number;

    const order: Order = {
      user_id: userId,
      status: "active",
    };
    const createdOrder = await orderStore.create(order);
    orderId = createdOrder.id as number;
  });

  it("should have an index method", () => {
    expect(orderStore.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(orderStore.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(orderStore.create).toBeDefined();
  });

  it("should have an addProduct method", () => {
    expect(orderStore.addProduct).toBeDefined();
  });

  it("create method should add an order", async () => {
    const order: Order = {
      user_id: userId,
      status: "active",
    };

    const result = await orderStore.create(order);
    orderId = result.id as number;

    expect(result.user_id).toBe(userId);
    expect(result.status).toBe("active");
  });

  it("index method should return a list of orders", async () => {
    const result = await orderStore.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return the correct order", async () => {
    const result = await orderStore.show(orderId.toString());
    expect(result.user_id).toBe(userId);
    expect(result.status).toBe("active");
  });

  it("addProduct method should add a product to an order", async () => {
    const result = await orderStore.addProduct({
      order_id: orderId,
      product_id: productId,
      quantity: 2,
    });

    expect(result.order_id).toBe(orderId);
    expect(result.product_id).toBe(productId);
    expect(result.quantity).toBe(2);
  });

  it("getCurrentOrderByUser method should return active order", async () => {
    const result = await orderStore.getCurrentOrderByUser(userId.toString());
    expect(result).not.toBeNull();
    if (result) {
      expect(result.status).toBe("active");
    }
  });

  it("updateStatus method should change order status", async () => {
    const result = await orderStore.updateStatus(
      orderId.toString(),
      "complete"
    );
    expect(result.status).toBe("complete");
  });

  it("getCompletedOrdersByUser method should return completed orders", async () => {
    const result = await orderStore.getCompletedOrdersByUser(userId.toString());
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].status).toBe("complete");
  });

  it("getOrderWithProducts method should return order with products", async () => {
    const result = await orderStore.getOrderWithProducts(orderId.toString());
    expect(result).not.toBeNull();
    if (result) {
      expect(result.products.length).toBeGreaterThan(0);
    }
  });

  // Clean up
  afterAll(async () => {
    await orderStore.delete(orderId.toString());
    await productStore.delete(productId.toString());
    await userStore.delete(userId.toString());
  });
});
