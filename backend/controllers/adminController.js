const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @route  GET /api/admin/stats  (admin)
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueAgg, byStatus, recentOrders] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      ]);

    const ordersByStatus = {};
    byStatus.forEach((s) => (ordersByStatus[s._id] = s.count));

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      ordersByStatus,
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/admin/orders  (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PATCH /api/admin/orders/:id/status  (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Status updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/admin/users  (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStats, getAllOrders, updateOrderStatus, getAllUsers };
