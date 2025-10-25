import client from "../database";

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export type OrderWithProducts = Order & {
  products: {
    product_id: number;
    quantity: number;
  }[];
};

export class OrderStore {
  // Get all orders
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get orders: ${err}`);
    }
  }

  // Get order by ID
  async show(id: string): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`Order with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get order ${id}: ${err}`);
    }
  }

  // Create new order
  async create(order: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *";
      const result = await conn.query(sql, [
        order.user_id,
        order.status || "active",
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create order: ${err}`);
    }
  }

  // Update order status
  async updateStatus(id: string, status: string): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = "UPDATE orders SET status=($1) WHERE id=($2) RETURNING *";
      const result = await conn.query(sql, [status, id]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`Order with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update order ${id}: ${err}`);
    }
  }

  // Delete order
  async delete(id: string): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM orders WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [id]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`Order with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to delete order ${id}: ${err}`);
    }
  }

  // Add product to order
  async addProduct(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      // First check if order status is active
      const orderSql = "SELECT status FROM orders WHERE id=($1)";
      const conn = await client.connect();
      const orderResult = await conn.query(orderSql, [orderProduct.order_id]);

      if (orderResult.rows.length === 0) {
        conn.release();
        throw new Error(`Order with id ${orderProduct.order_id} not found`);
      }

      if (orderResult.rows[0].status !== "active") {
        conn.release();
        throw new Error("Cannot add products to a completed order");
      }

      const sql =
        "INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [
        orderProduct.order_id,
        orderProduct.product_id,
        orderProduct.quantity,
      ]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to add product to order: ${err}`);
    }
  }

  // Get current order by user (active orders)
  async getCurrentOrderByUser(userId: string): Promise<Order | null> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT * FROM orders WHERE user_id=($1) AND status='active' ORDER BY id DESC LIMIT 1";
      const result = await conn.query(sql, [userId]);
      conn.release();

      return result.rows.length ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Unable to get current order for user ${userId}: ${err}`);
    }
  }

  // Get completed orders by user
  async getCompletedOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT * FROM orders WHERE user_id=($1) AND status='complete' ORDER BY id DESC";
      const result = await conn.query(sql, [userId]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Unable to get completed orders for user ${userId}: ${err}`
      );
    }
  }

  // Get order with products
  async getOrderWithProducts(
    orderId: string
  ): Promise<OrderWithProducts | null> {
    try {
      const conn = await client.connect();

      // Get order
      const orderSql = "SELECT * FROM orders WHERE id=($1)";
      const orderResult = await conn.query(orderSql, [orderId]);

      if (orderResult.rows.length === 0) {
        conn.release();
        return null;
      }

      // Get products in order
      const productsSql =
        "SELECT product_id, quantity FROM order_products WHERE order_id=($1)";
      const productsResult = await conn.query(productsSql, [orderId]);

      conn.release();

      const order: OrderWithProducts = {
        ...orderResult.rows[0],
        products: productsResult.rows,
      };

      return order;
    } catch (err) {
      throw new Error(`Unable to get order with products ${orderId}: ${err}`);
    }
  }
}
