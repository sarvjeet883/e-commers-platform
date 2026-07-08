const Order = require('../models/Order');

// Generate a human-friendly unique order number, e.g. ECO-M3K9X2-481
const generateOrderNumber = () =>
  `ECO-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

// @route  POST /api/orders
// @desc   Place an order after UPI payment (protected)
const createOrder = async (req, res) => {
  const { items, totalAmount, utrNumber, shippingAddress } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    if (!utrNumber || !utrNumber.trim()) {
      return res.status(400).json({ message: 'UTR number is required' });
    }

    const order = await Order.create({
      user: req.user.userId,
      orderNumber: generateOrderNumber(),
      items,
      totalAmount,
      utrNumber: utrNumber.trim(),
      shippingAddress,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      orderNumber: order.orderNumber,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/orders/my
// @desc   List the logged-in user's orders, newest first (protected)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getMyOrders };
