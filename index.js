const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

// creating the app
const app = express();

// middleware
app.use(
  cors({ origin: ["http://localhost:5173", "https://foodie-be4f4.web.app"] })
);
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
    const productCollection = client.db("foodieDB").collection("products");
    const cartCollection = client.db("foodieDB").collection("cart");

    // Welcome route
    app.get("/", (req, res) => {
      res.send(`<h1>Welcome to Foodie Backend!</h1>`);
    });

    // Get all brands
    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    // Get single brand
    app.get("/brands/:name", async (req, res) => {
      const name = req.params.name;

      const filter = { brand: name };

      const result = await productCollection.find(filter).toArray();

      res.send(result);
    });

    // Add brand
    app.post("/addbrand", async (req, res) => {
      const brand = await req.body;
      const result = await brandCollection.insertOne(brand);
      res.send(result);
    });

    // Add Product
    app.post("/addproduct", async (req, res) => {
      const product = await req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    // Get all products
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    // Get single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);

      res.send(result);
    });

    // Add cart
    app.post("/addcart", async (req, res) => {
      const cart = await req.body;

      // check if already exist
      const query = { productId: cart.productId, email: req.query.email };
      const cartExist = await cartCollection.findOne(query);

      if (cartExist) {
        const amount = cartExist.amount + 1;
        const result = await cartCollection.updateOne(query, {
          $set: { amount: amount },
        });
        res.send({ result, alreadyExist: true });
      } else {
        const result = await cartCollection.insertOne({
          ...cart,
        });
        res.send(result);
      }
    });

    // Get cart
    app.get("/cart", async (req, res) => {
      const result = await cartCollection
        .find({ email: req.query.email })
        .toArray();
      res.send(result);
    });

    // delete cart
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: id };
      const result = await cartCollection.deleteOne(query);

      res.send(result);
    });

    // Update product
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const product = await req.body;

      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updateDoc = {
        $set: {
          name: product.name,
          brand: product.brand,
          type: product.type,
          price: product.price,
          photo: product.photo,
          rating: product.rating,
          desc: product.desc,
        },
      };

      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        option
      );

      res.send(result);
    });
  } finally {
  }
};
run()
  .then(() => {
    // Creating the server
    app.listen(port, () => {
      console.log(`Foodie backend is running on port: ${port}`);
    });
  })
  .catch(console.dir);
