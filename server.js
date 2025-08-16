require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

// --- START OF NEW DEBUGGING CODE ---
async function startServer() {
  try {
    console.log("===================================");
    console.log("Attempting to start the server...");

    const app = express();
    const PORT = process.env.PORT || 5000;
    const MONGO_URI = process.env.MONGO_URI;

    // Check for MONGO_URI explicitly
    if (!MONGO_URI) {
      console.error("FATAL ERROR: MONGO_URI environment variable is not set.");
      process.exit(1); // Exit with a failure code
    }
    
    console.log("MONGO_URI found. Attempting to connect to MongoDB...");
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
      console.log("===================================");
    });

  } catch (error) {
    console.error("!!!!!!!!!! SERVER FAILED TO START !!!!!!!!!!");
    console.error("THE REASON IS:", error);
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    process.exit(1); // Exit with a failure code to make sure Render sees the crash
  }
}

startServer();
// --- END OF NEW DEBUGGING CODE ---