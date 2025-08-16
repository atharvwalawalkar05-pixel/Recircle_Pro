require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

async function startServer() {
  try {
    const app = express();
    const PORT = process.env.PORT || 5000;
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error("FATAL ERROR: MONGO_URI environment variable is not set.");
      process.exit(1);
    }
    
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");

    app.use(express.json());
    app.use(cors());

    app.use('/api/auth', authRoutes);
    app.use('/api/items', itemRoutes);

    app.get('/', (req, res) => {
      res.send('ReCircle Backend API is running!');
    });

    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });

  } catch (error) {
    console.error("SERVER FAILED TO START:", error);
    process.exit(1);
  }
}

startServer();