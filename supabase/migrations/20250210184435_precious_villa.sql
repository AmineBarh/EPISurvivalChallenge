/*
  # E-commerce Schema Setup

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `rating` (numeric)
      - `image_url` (text)
      - `category` (text)
      - `created_at` (timestamp)
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Products are readable by all, but only admins can modify
    - Cart items are private to each user
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL CHECK (price >= 0),
    rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
    image_url text NOT NULL,
    category text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    product_id uuid REFERENCES products NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
    TO public
    USING (true);

-- Cart policies
CREATE POLICY "Users can view their own cart items"
    ON cart_items FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
    ON cart_items FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
    ON cart_items FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
    ON cart_items FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Insert sample products
INSERT INTO products (name, description, price, rating, image_url, category) VALUES
('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 199.99, 4.5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Electronics'),
('Smart Watch', 'Fitness tracking smartwatch with heart rate monitor', 299.99, 4.2, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 'Electronics'),
('Leather Backpack', 'Handcrafted genuine leather backpack', 149.99, 4.8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 'Accessories'),
('Running Shoes', 'Lightweight performance running shoes', 129.99, 4.3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 'Sports'),
('Coffee Maker', 'Programmable drip coffee maker', 79.99, 4.1, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6', 'Home'),
('Sunglasses', 'Polarized UV protection sunglasses', 89.99, 4.4, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083', 'Accessories');