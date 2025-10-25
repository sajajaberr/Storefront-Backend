import client from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  // Get all products
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get products: ${err}`);
    }
  }

  // Get product by ID
  async show(id: string): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get product ${id}: ${err}`);
    }
  }

  // Create new product
  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category || null,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create product ${product.name}: ${err}`);
    }
  }

  // Update product
  async update(id: string, product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        "UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *";
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category || null,
        id,
      ]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update product ${id}: ${err}`);
    }
  }

  // Delete product
  async delete(id: string): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM products WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [id]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to delete product ${id}: ${err}`);
    }
  }

  // Get products by category (bonus feature)
  async getByCategory(category: string): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE category=($1)";
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get products by category ${category}: ${err}`);
    }
  }
}
