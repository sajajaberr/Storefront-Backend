import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import { verifyAuthToken } from "../middleware/auth";

const store = new ProductStore();

// Get all products
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get product by ID
const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await store.show(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Create new product (requires token)
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    if (!product.name || !product.price) {
      res.status(400).json({ error: "Missing required fields: name, price" });
      return;
    }

    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Update product (requires token)
const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    if (!product.name || !product.price) {
      res.status(400).json({ error: "Missing required fields: name, price" });
      return;
    }

    const updatedProduct = await store.update(req.params.id, product);
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Delete product (requires token)
const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get products by category
const getByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.getByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const productsRoutes = (app: express.Application): void => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
  app.put("/products/:id", verifyAuthToken, update);
  app.delete("/products/:id", verifyAuthToken, destroy);
  app.get("/products/category/:category", getByCategory);
};

export default productsRoutes;
