const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const img = (id) => `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`;

const products = [
  { name: 'Wireless Headphones', description: 'Over-ear Bluetooth headphones with 30-hour battery life.', price: 2499, category: 'Electronics', stock: 25, image: img('1505740420928-5e560c06d30e') },
  { name: 'Smart Watch', description: 'Fitness tracking, heart-rate monitor and notifications.', price: 3999, category: 'Electronics', stock: 15, image: img('1523275335684-37898b6baf30') },
  { name: 'Running Shoes', description: 'Lightweight breathable shoes for daily running.', price: 1899, category: 'Fashion', stock: 40, image: img('1542291026-7eec264c27ff') },
  { name: 'Backpack', description: 'Water-resistant 25L backpack with laptop compartment.', price: 1299, category: 'Fashion', stock: 30, image: img('1553062407-98eeb64c6a62') },
  { name: 'Coffee Mug Set', description: 'Set of 4 ceramic mugs, dishwasher safe.', price: 699, category: 'Home', stock: 50, image: img('1514228742587-6b1558fcf93a') },
  { name: 'Desk Lamp', description: 'Adjustable LED desk lamp with 3 brightness levels.', price: 899, category: 'Home', stock: 20, image: img('1507473885765-e6ed057f782c') },
  { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with blue switches.', price: 3299, category: 'Electronics', stock: 12, image: img('1587829741301-dc798b83add3') },
  { name: 'Yoga Mat', description: 'Non-slip 6mm yoga mat with carrying strap.', price: 799, category: 'Sports', stock: 35, image: img('1601925260368-ae2f83cf8b7f') },
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