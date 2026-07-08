const mongoose = require('mongoose');

const CATEGORIES = [
  'Normal Skin',
  'Dry Skin',
  'Oily Skin',
  'Combination Skin',
  'Sensitive Skin',
];

const productSchema = new mongoose.Schema(
  {
    // Numeric id kept for frontend routes (/product/:id) and cart compatibility
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: String, required: [true, 'Price is required'] }, // e.g. "₹399"
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    noOfRating: { type: Number, default: 0, min: 0 },
    image: { type: String, required: [true, 'Image URL is required'] },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: 'Invalid category' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIES = CATEGORIES;
