import express, { Request, Response } from "express";
import { Order, OrderProduct, OrderStore } from "../models/order";
import { verifyAuthToken } from "../middleware/auth";

const store = new OrderStore();

// Get all orders (requires token)
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get order by ID (requires token)
const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.show(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Create new order (requires token)
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: Order = {
      user_id: req.body.user_id,
      status: req.body.status || "active",
    };

    if (!order.user_id) {
      res.status(400).json({ error: "Missing required field: user_id" });
      return;
    }

    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Update order status (requires token)
const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: "Missing required field: status" });
      return;
    }

    if (status !== "active" && status !== "complete") {
      res
        .status(400)
        .json({ error: 'Status must be either "active" or "complete"' });
      return;
    }

    const updatedOrder = await store.updateStatus(req.params.id, status);
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Add product to order (requires token)
const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderProduct: OrderProduct = {
      order_id: parseInt(req.params.id),
      product_id: req.body.product_id,
      quantity: req.body.quantity,
    };

    if (!orderProduct.product_id || !orderProduct.quantity) {
      res
        .status(400)
        .json({ error: "Missing required fields: product_id, quantity" });
      return;
    }

    const addedProduct = await store.addProduct(orderProduct);
    res.json(addedProduct);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get current order by user (requires token)
const getCurrentOrderByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await store.getCurrentOrderByUser(req.params.userId);

    if (!order) {
      res.status(404).json({ message: "No active order found for this user" });
      return;
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get completed orders by user (requires token)
const getCompletedOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await store.getCompletedOrdersByUser(req.params.userId);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get order with products (requires token)
const getOrderWithProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await store.getOrderWithProducts(req.params.id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const ordersRoutes = (app: express.Application): void => {
  app.get("/orders", verifyAuthToken, index);
  app.get("/orders/:id", verifyAuthToken, show);
  app.post("/orders", verifyAuthToken, create);
  app.put("/orders/:id/status", verifyAuthToken, updateStatus);
  app.post("/orders/:id/products", verifyAuthToken, addProduct);
  app.get("/orders/user/:userId", verifyAuthToken, getCurrentOrderByUser);
  app.get(
    "/orders/user/:userId/completed",
    verifyAuthToken,
    getCompletedOrdersByUser
  );
  app.get("/orders/:id/products", verifyAuthToken, getOrderWithProducts);
};

export default ordersRoutes;
