const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const products = [
  { name: 'Wireless Headphones', description: 'Over-ear Bluetooth headphones with 30-hour battery life.', price: 2499, category: 'Electronics', stock: 25, image: 'https://picsum.photos/seed/headphones/400/300' },
  { name: 'Smart Watch', description: 'Fitness tracking, heart-rate monitor and notifications.', price: 3999, category: 'Electronics', stock: 15, image: 'https://picsum.photos/seed/watch/400/300' },
  { name: 'Running Shoes', description: 'Lightweight breathable shoes for daily running.', price: 1899, category: 'Fashion', stock: 40, image: 'https://picsum.photos/seed/shoes/400/300' },
  { name: 'Backpack', description: 'Water-resistant 25L backpack with laptop compartment.', price: 1299, category: 'Fashion', stock: 30, image: 'https://picsum.photos/seed/backpack/400/300' },
  { name: 'Coffee Mug Set', description: 'Set of 4 ceramic mugs, dishwasher safe.', price: 699, category: 'Home', stock: 50, image: 'https://picsum.photos/seed/mugs/400/300' },
  { name: 'Desk Lamp', description: 'Adjustable LED desk lamp with 3 brightness levels.', price: 899, category: 'Home', stock: 20, image: 'https://picsum.photos/seed/lamp/400/300' },
  { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with blue switches.', price: 3299, category: 'Electronics', stock: 12, image: 'https://picsum.photos/seed/keyboard/400/300' },
  { name: 'Yoga Mat', description: 'Non-slip 6mm yoga mat with carrying strap.', price: 799, category: 'Sports', stock: 35, image: 'https://picsum.photos/seed/yogamat/400/300' },
];

const run = async () => {
  await connectDB();
  await Product.deleteMany();
  await User.deleteMany({ email: 'admin@store.com' });
  await User.create({ name: 'Admin', email: 'admin@store.com', password: 'admin123', role: 'admin' });
  await Product.insertMany(products);
  console.log('Seeded: 1 admin (admin@store.com / admin123) and', products.length, 'products');
  process.exit();
};

run();