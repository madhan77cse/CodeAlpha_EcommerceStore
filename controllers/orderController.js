const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: 'A product in your cart no longer exists' });
      }
      const qty = Number(item.qty);
      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
      if (product.stock < qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      orderItems.push({ product: product._id, name: product.name, price: product.price, qty });
      totalPrice += product.price * qty;
    }

    for (const oi of orderItems) {
      await Product.findByIdAndUpdate(oi.product, { $inc: { stock: -oi.qty } });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};