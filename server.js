require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

console.log("===================================");
console.log("Attempting to start the SIMPLEST server...");

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('The simple server is running!');
});

app.listen(PORT, () => {
  console.log(`Simple server is LIVE on port ${PORT}`);
  console.log("===================================");
});