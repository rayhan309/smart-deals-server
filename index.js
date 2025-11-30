const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// MIIDIDLWER
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smart-server:smartServer@cluster0.sr4duj3.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// db password smartServer

async function run() {
  try {
    await client.connect();

    const db = client.db("db");
    const products = db.collection("products");
    const bids = db.collection("bids");
    const users = db.collection("users");

    app.post("/users", async (req, res) => {
      const newUser = req.body;

      const email = req.body.email;
      const query = { email: email };
      const existingUser = await users.findOne(query);

      if (existingUser) {
        res.send({
          message: "this user alrady exists, do not need to insert aging",
        });
      } else {
        const result = await users.insertOne(newUser);
        res.send(result);
      }
    });

    // all products get
    app.get("/products", async (req, res) => {
      // const projectFinnale = {title : 1, price_min: 1}
      // const cursor = products.find().sort({price_min: -1}).skip(2).limit(5).project(projectFinnale);

      const cursor = products.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // latest products
    app.get("/latest-products", async (req, res) => {
      const cursor = products.find().sort({ created_at: 1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // find one
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const quire = { _id: new ObjectId(id) };
      const result = await products.findOne(quire);
      res.send(result);
    });

    // post methord
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await products.insertOne(newProduct);
      res.send(result);
    });

    // update methode
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const quire = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };
      const result = await products.updateOne(quire, update);
      res.send(result);
    });

    // delete methode
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const quire = { _id: new ObjectId(id) };
      const result = await products.deleteOne(quire);
      res.send(result);
    });

    // bids releted Apis
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }

      const cursor = bids.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // bids products id
    app.get("/bids/byProducts/:id", async (req, res) => {
      const productId = req.params.id;
      const query = { product: productId };
      console.log(query);
      const cursor = bids.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // single bids
    app.get("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bids.findOne(query);
      res.send(result);
    });

    // post
    app.post("/bids", async (req, res) => {
      const newBids = req.body;
      const result = await bids.insertOne(newBids);
      res.send(result);
    });

    // delete
    app.delete("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bids.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Smart Server Is Running!");
});

app.listen(port, () => {
  console.log(`Smart server listening on port ${port}`);
});
