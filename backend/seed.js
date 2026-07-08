// Seed script: imports the product catalogue into MongoDB and creates the admin account.
// Run with: npm run seed
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');

const Product = require('./models/Product');
const User = require('./models/User');

const PRODUCTS_JSON = path.join(__dirname, '..', 'frontend', 'src', 'data', 'myProducts.json');

const ADMIN = {
  name: 'EcoGlam Admin',
  email: 'admin@ecoglam.com',
  password: 'admin123',
  role: 'admin',
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Seed products (upsert by numeric id so re-running is safe)
    const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
    for (const p of products) {
      await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, runValidators: true });
    }
    console.log(`Seeded ${products.length} products`);

    // Create admin user if missing
    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('Existing user promoted to admin');
      } else {
        console.log('Admin user already exists');
      }
    } else {
      await User.create(ADMIN); // password hashed by the model hook
      console.log(`Admin created: ${ADMIN.email} / ${ADMIN.password}`);
    }

    await mongoose.disconnect();
    console.log('Seeding complete');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
