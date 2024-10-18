const express = require("express")
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config()
const cors = require("cors")
const port = process.env.PORT || 5000 

//middlewares 

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4dm99p5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const productsCollection =  client.db('nexBellDb').collection('products');
    const cartCollection = client.db('nexBellDb').collection('cart');


//  getting all the products

app.get("/products", async(req,res)=> {
    const result = await productsCollection.find().toArray()
    res.send(result)
})


// users cart products 

app.get("/cart", async (req, res) => {
    const userEmail = req.query.email;  
  
    try {
      const cartItems = await cartCollection.find({ userEmail: userEmail }).toArray();  
      res.send(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.send({ success: false, message: "Failed to fetch cart items" });
    }
  });
  





// users add to cart
app.post("/addToCart", async (req, res) => {
    const cartItem = req.body;  
  
    try {
      const result = await cartCollection.insertOne(cartItem);  
      res.send({ success: true, message: "Item added to cart", result });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.send({ success: false, message: "Failed to add item to cart" });
    }
  });





// Route to delete an item from the cart
app.delete("/cart/:id", async (req, res) => {
    const itemId = req.params.id;  // Get the item ID from the request parameters
  
    try {
      // Use MongoDB's deleteOne method to remove the item by its _id
      const result = await cartCollection.deleteOne({ id: itemId });
  
      if (result.deletedCount === 1) {
        res.send({ success: true, message: "Item removed from cart" });
      } else {
        res.send({ success: false, message: "Item not found" });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.send({ success: false, message: "Failed to remove item from cart" });
    }
  });
  







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get('/' , (req,res)=> {
    res.send("server is running")
})

app.listen(port , ()=> {
    console.log(`server is running on the port ${port}`)
})