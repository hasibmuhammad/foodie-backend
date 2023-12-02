const express = require("express");
const cors = require("cors");

// creating the app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Creating the server
app.listen(port, () => {
  console.log(`Foodie backend is running on port: ${port}`);
});
