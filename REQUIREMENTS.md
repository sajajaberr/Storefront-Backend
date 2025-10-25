# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Products

#### Index

- **Route:** `/products` [GET]
- **Description:** Returns a list of all products
- **Authentication:** Not required
- **Request Body:** None
- **Response:**

```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 29.99,
    "category": "Electronics"
  }
]
```

#### Show

- **Route:** `/products/:id` [GET]
- **Description:** Returns a specific product by ID
- **Authentication:** Not required
- **Request Body:** None
- **Response:**

```json
{
  "id": 1,
  "name": "Product Name",
  "price": 29.99,
  "category": "Electronics"
}
```

#### Create

- **Route:** `/products` [POST]
- **Description:** Creates a new product
- **Authentication:** **Token required**
- **Request Body:**

```json
{
  "name": "Product Name",
  "price": 29.99,
  "category": "Electronics"
}
```

- **Response:**

```json
{
  "id": 1,
  "name": "Product Name",
  "price": 29.99,
  "category": "Electronics"
}
```

#### Update

- **Route:** `/products/:id` [PUT]
- **Description:** Updates an existing product
- **Authentication:** **Token required**
- **Request Body:**

```json
{
  "name": "Updated Product Name",
  "price": 39.99,
  "category": "Electronics"
}
```

- **Response:**

```json
{
  "id": 1,
  "name": "Updated Product Name",
  "price": 39.99,
  "category": "Electronics"
}
```

#### Delete

- **Route:** `/products/:id` [DELETE]
- **Description:** Deletes a product
- **Authentication:** **Token required**
- **Request Body:** None
- **Response:**

```json
{
  "id": 1,
  "name": "Product Name",
  "price": 29.99,
  "category": "Electronics"
}
```

#### Products by Category

- **Route:** `/products/category/:category` [GET]
- **Description:** Returns all products in a specific category
- **Authentication:** Not required
- **Request Body:** None
- **Response:** Array of products

### Users

#### Index

- **Route:** `/users` [GET]
- **Description:** Returns a list of all users
- **Authentication:** **Token required**
- **Request Body:** None
- **Response:**

```json
[
  {
    "id": 1,
    "username": "john_doe",
    "firstname": "John",
    "lastname": "Doe"
  }
]
```

#### Show

- **Route:** `/users/:id` [GET]
- **Description:** Returns a specific user by ID
- **Authentication:** **Token required**
- **Request Body:** None
- **Response:**

```json
{
  "id": 1,
  "username": "john_doe",
  "firstname": "John",
  "lastname": "Doe"
}
```

#### Create

- **Route:** `/users` [POST]
- **Description:** Creates a new user (registration)
- **Authentication:** Not required
- **Request Body:**

```json
{
  "username": "john_doe",
  "firstname": "John",
  "lastname": "Doe",
  "password": "secure_password"
}
```

- **Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

#### Authenticate

- **Route:** `/users/authenticate` [POST]
- **Description:** Authenticates a user and returns a JWT token
- **Authentication:** Not required
- **Request Body:**

```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

- **Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

#### Index

- **Route:** `/orders` [GET]
- **Description:** Returns a list of all orders
- **Authentication:** **Token required**
- **Request Body:** None
- **Response:**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "status": "active"
  }
]
```

#### Show

- **Route:** `/orders/:id` [GET]
- **Description:** Returns a specific order by ID
- **Authentication:** **Token required**
- **Request Body:** None
- **Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "status": "active"
}
```

#### Create

- **Route:** `/orders` [POST]
- **Description:** Creates a new order
- **Authentication:** **Token required**
- **Request Body:**

```json
{
  "user_id": 1,
  "status": "active"
}
```

- **Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "status": "active"
}
```

#### Update Status

- **Route:** `/orders/:id/status` [PUT]
- **Description:** Updates the status of an order
- **Authentication:** **Token required**
- **Request Body:**

```json
{
  "status": "complete"
}
```

- **Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "status": "complete"
}
```

#### Add Product to Order

- **Route:** `/orders/:id/products` [POST]
- **Description:** Adds a product to an order
- **Authentication:** **Token required**
- **Request Body:**

```json
{
  "product_id": 1,
  "quantity": 2
}
```

- **Response:**

```json
{
  "id": 1,
  "order_id": 1,
  "product_id": 1,
  "quantity": 2
}
```

#### Current Order by User

- **Route:** `/orders/user/:userId` [GET]
- **Description:** Returns the current active order for a user
- **Authentication:** **Token required**
- **Request Body:** None
- **Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "status": "active"
}
```

#### Completed Orders by User

- **Route:** `/orders/user/:userId/completed` [GET]
- **Description:** Returns all completed orders for a user
- **Authentication:** **Token required**
- **Request Body:** None
- **Response:**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "status": "complete"
  }
]
```

#### Get Order with Products

- **Route:** `/orders/:id/products` [GET]
- **Description:** Returns an order with all its products
- **Authentication:** **Token required**
- **Request Body:** None
- **Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "status": "active",
  "products": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

## Data Shapes

### Product

```typescript
{
  id?: number
  name: string
  price: number
  category?: string
}
```

### User

```typescript
{
  id?: number
  username: string
  firstname: string
  lastname: string
  password: string
  password_digest?: string
}
```

### Order

```typescript
{
  id?: number
  user_id: number
  status: string  // 'active' or 'complete'
}
```

### OrderProduct (join table)

```typescript
{
  id?: number
  order_id: number
  product_id: number
  quantity: number
}
```

## Database Schema

### Table: users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    password_digest VARCHAR(255) NOT NULL
);
```

- **id:** Primary key, auto-incrementing integer
- **username:** Unique username for the user
- **firstname:** User's first name
- **lastname:** User's last name
- **password_digest:** Hashed password using bcrypt

### Table: products

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100)
);
```

- **id:** Primary key, auto-incrementing integer
- **name:** Product name
- **price:** Product price (numeric with 2 decimal places)
- **category:** Product category (optional)

### Table: orders

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'complete'))
);
```

- **id:** Primary key, auto-incrementing integer
- **user_id:** Foreign key referencing users table
- **status:** Order status, either 'active' or 'complete', defaults to 'active'

### Table: order_products

```sql
CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);
```

- **id:** Primary key, auto-incrementing integer
- **order_id:** Foreign key referencing orders table
- **product_id:** Foreign key referencing products table
- **quantity:** Quantity of the product in the order (must be greater than 0)

## Authentication & Authorization

### JWT Token Authentication

Protected routes require a JSON Web Token (JWT) in the Authorization header:

```
Authorization: Bearer <token>
```

### Token Generation

Tokens are generated when:

1. A user registers (`POST /users`)
2. A user logs in (`POST /users/authenticate`)

### Protected Routes

The following routes require authentication:

- All `/users` routes except POST (create) and POST (authenticate)
- POST, PUT, DELETE for `/products`
- All `/orders` routes

### Password Security

- Passwords are hashed using bcrypt with salt
- Plain text passwords are never stored in the database
- Password hashes use the `BCRYPT_PASSWORD` environment variable as pepper
- Salt rounds are configurable via `SALT_ROUNDS` environment variable
