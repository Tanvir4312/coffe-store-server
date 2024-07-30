const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middlewere
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h2tkvzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const usersCollection = client.db('coffeeDB').collection('user')

    app.get('/coffees', async (req, res) => {
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })

    app.post('/coffees', async (req, res) => {
      const coffeeItems = req.body
      console.log(coffeeItems)

      const result = await coffeeCollection.insertOne(coffeeItems)
      res.send(result)
    })

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const coffe = req.body;
      console.log(id, coffe)

      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateCoffe = {
        $set: {
          name: coffe.name,
          quantity: coffe.quantity,
          supplier: coffe.supplier,
          taste: coffe.taste,
          category: coffe.category,
          details: coffe.details,
          photo: coffe.photo,

        }
      }
      const result = await coffeeCollection.updateOne(filter, updateCoffe, options)
      res.send(result)
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    // User Section
    app.get('/users', async(req, res) => {
      const cursor = usersCollection.find()
      const user = await cursor.toArray()
      res.send(user)
    })

    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/users', async (req, res) => {
      const user = req.body;
      const filter = {email: user.email}
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);




app.get('/', (req, res) => {
  res.send('coffee server comming soon.....')
})

app.listen(port, () => {
  console.log(`inside the server running on ${port}`)
})