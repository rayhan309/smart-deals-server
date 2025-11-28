const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// MIIDIDLWER
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://smart-server:smartServer@cluster0.sr4duj3.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// db password smartServer

async function run() {
  try {

    await client.connect();

    const db = client.db("db");
    const products = db.collection("products");

    // post methord 
    app.post('/products', async (req, res) => {
        const newProduct = req.body;
        const result = await products.insertOne(newProduct);
        res.send(result);
    });

    // update methode
    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const quire = {_id: new ObjectId(id)};
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price
        }
      };
      const result = await products.updateOne(quire, update);
      res.send(result)
    });

    // delete methode
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const quire = {_id: new ObjectId(id)};
      const result = await products.deleteOne(quire);
      app.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Smart Server Is Running!')
});


app.listen(port, () => {
  console.log(`Smart server listening on port ${port}`)
});