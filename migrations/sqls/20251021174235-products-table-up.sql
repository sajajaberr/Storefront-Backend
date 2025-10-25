CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100)
);