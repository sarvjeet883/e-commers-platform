const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    image: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, 'Order must contain at least one item'],
    },
    totalAmount: { type: Number, required: true, min: 0 },
    utrNumber: { type: String, required: true, trim: true },
    shippingAddress: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
