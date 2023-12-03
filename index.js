const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

// creating the app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// MongoDB
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.er9gvke.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // creating db and collections
    const brandCollection = client.db("foodieDB").collection("brands");

    // Add brand
    app.post("/addbrand", async (req, res) => {
      const brand = await req.body;

      const result = await brandCollection.insertOne(brand);

      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);

// Welcome route
app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Foodie Backend!</h1>`);
});

// Creating the server
app.listen(port, () => {
  console.log(`Foodie backend is running on port: ${port}`);
});
