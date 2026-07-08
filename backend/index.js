const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      'https://ecoglam.vercel.app',
      'https://ecoglam-xi.vercel.app',
      'https://ecoglam-phi.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

// Routes
app.get('/', (req, res) => res.json({ message: 'EcoGlam API is running' }));
app.use('/', authRoutes);          // POST /signup, POST /login, GET /profile
app.use('/api/orders', orderRoutes); // POST /api/orders, GET /api/orders/my
app.use('/api/products', productRoutes); // public list + admin CRUD
app.use('/api/admin', adminRoutes);      // dashboard stats, orders, users

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
