import supertest from "supertest";
import app from "../../server";
import { UserStore } from "../../models/user";
import { ProductStore } from "../../models/product";
import { OrderStore } from "../../models/order";

const request = supertest(app);
let token: string;
let userId: number;
let productId: number;
let orderId: number;
let createdUsername: string;

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

describe("API Endpoints", () => {
  beforeAll(async () => {
    // Create a test user and get token
    try {
      const testUser = await userStore.create({
        username: "apitest_" + Date.now(),
        firstname: "API",
        lastname: "Test",
        password: "password123",
      });
      userId = testUser.id as number;

      // Authenticate to get token
      const authUser = await userStore.authenticate(
        testUser.username,
        "password123"
      );
      if (authUser) {
        // Generate token manually for testing
        const jwt = require("jsonwebtoken");
        token = jwt.sign(
          { user: authUser },
          process.env.TOKEN_SECRET as string
        );
      }
    } catch (error) {
      console.error("Setup error:", error);
    }
  });
  // Users Endpoints
  describe("Users Endpoints", () => {
    it("POST /users - creates a new user and returns a token", async () => {
      const uniqueUsername = "apitest_" + Date.now();
      const response = await request.post("/users").send({
        username: uniqueUsername,
        firstname: "API",
        lastname: "Test",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe(uniqueUsername);

      createdUsername = uniqueUsername;
      token = response.body.token;
      userId = response.body.user.id;
    });

    it("POST /users/authenticate - authenticates user and returns token", async () => {
      // First create a user for authentication test
      const uniqueUsername = "authtest_" + Date.now();
      await request.post("/users").send({
        username: uniqueUsername,
        firstname: "Auth",
        lastname: "Test",
        password: "password123",
      });

      const response = await request.post("/users/authenticate").send({
        username: uniqueUsername,
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe(uniqueUsername);
    });

    it("POST /users/authenticate - fails with wrong password", async () => {
      const response = await request.post("/users/authenticate").send({
        username: "apitest",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
    });

    it("GET /users - requires token", async () => {
      const response = await request.get("/users");
      expect(response.status).toBe(401);
    });

    it("GET /users - returns list of users with token", async () => {
      const response = await request
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("GET /users/:id - returns specific user with token", async () => {
      const response = await request
        .get(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(createdUsername);
    });
  });

  // Products Endpoints
  describe("Products Endpoints", () => {
    it("GET /products - returns list of products (no token required)", async () => {
      const response = await request.get("/products");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("POST /products - requires token", async () => {
      const response = await request.post("/products").send({
        name: "Test Product",
        price: 29.99,
        category: "Test",
      });

      expect(response.status).toBe(401);
    });

    it("POST /products - creates product with token", async () => {
      const response = await request
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "API Test Product",
          price: 39.99,
          category: "Electronics",
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("API Test Product");
      productId = response.body.id;
    });

    it("GET /products/:id - returns specific product", async () => {
      const response = await request.get(`/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("API Test Product");
    });

    it("PUT /products/:id - updates product with token", async () => {
      const response = await request
        .put(`/products/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Updated API Product",
          price: 49.99,
          category: "Electronics",
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated API Product");
    });
  });

  // Orders Endpoints
  describe("Orders Endpoints", () => {
    it("GET /orders - requires token", async () => {
      const response = await request.get("/orders");
      expect(response.status).toBe(401);
    });

    it("POST /orders - creates order with token", async () => {
      const response = await request
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: userId,
          status: "active",
        });

      expect(response.status).toBe(200);
      expect(response.body.user_id).toBe(userId);
      orderId = response.body.id;
    });

    it("GET /orders/:id - returns specific order with token", async () => {
      const response = await request
        .get(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(orderId);
    });

    it("POST /orders/:id/products - adds product to order", async () => {
      const response = await request
        .post(`/orders/${orderId}/products`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          product_id: productId,
          quantity: 3,
        });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(3);
    });

    it("GET /orders/user/:userId - returns current order", async () => {
      const response = await request
        .get(`/orders/user/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("active");
    });

    it("PUT /orders/:id/status - updates order status", async () => {
      const response = await request
        .put(`/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "complete",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("complete");
    });

    it("GET /orders/user/:userId/completed - returns completed orders", async () => {
      const response = await request
        .get(`/orders/user/${userId}/completed`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("GET /orders/:id/products - returns order with products", async () => {
      const response = await request
        .get(`/orders/${orderId}/products`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.products).toBeDefined();
      expect(response.body.products.length).toBeGreaterThan(0);
    });
  });
  // Clean up after all tests
  afterAll(async () => {
    try {
      if (orderId) await orderStore.delete(orderId.toString());
      if (productId) await productStore.delete(productId.toString());
      if (userId) await userStore.delete(userId.toString());
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  });
});
