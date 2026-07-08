const Product = require('../models/Product');

// @route  GET /api/products  (public)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  POST /api/products  (admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, rating, noOfRating, image, category } = req.body;

    // Auto-assign the next numeric id
    const last = await Product.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const product = await Product.create({
      id: nextId,
      name,
      description,
      price,
      rating,
      noOfRating,
      image,
      category,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PUT /api/products/:id  (admin)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, rating, noOfRating, image, category } = req.body;
    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      { name, description, price, rating, noOfRating, image, category },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated', product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  DELETE /api/products/:id  (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
