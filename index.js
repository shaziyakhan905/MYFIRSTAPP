const express = require('express'); //it is CommonJs import not ES Module import
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()

app.use(express.json()); // to parse JSON body

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Start the server after successful connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Mock data
let products = [
    { id: 1, name: 'Laptop', price: 800 },
    { id: 2, name: 'Phone', price: 500 },
    { id: 3, name: 'Tablet', price: 300 }
  ];

  
// app.get('/', (req, res) => res.send('Home Route'));

// GET all products
app.get('/', (req, res) => {
    res.json(products);
});

const allRoutes = require('./routes');
app.use('/api/user', allRoutes.userRoutes);

// Get Single Product
//  app.get('/singleProducts/:id' , (req,res)=>{
//     const singleProduct = products.find((el)=> el.id === parseInt(req.params.id))
//     if(!singleProduct){
// return res.status(404).send("Product Not Fond")
//     } 
//     res.json(singleProduct)
//  })

//  // POST add new product
//  app.post("/products" , (req,res)=>{
//  const newProduct = {
//     id: products.length + 1,
//     name: req.body.name,
//     price:req.body.price
//  }
//  products.push(newProduct)
//  res.status(201).json(newProduct)
//  })
//  // PUT update a product
//  app.put("/products/:id" , (req,res)=>{
//     const updateProduct = products.find((el)=> el.id === parseInt(req.params.id))
//     if(!updateProduct){
//         return res.status(404).send("Product not fond")
//     }
//     updateProduct.name = req.body.name || products.name
//     updateProduct.price = req.body.price || products.price
//     res.json(updateProduct)
//  })
//  // DELETE a product
//  app.delete("/deleteProduct/:id",(req,res)=>{
//     const index = products.findIndex((el)=>el.id === parseInt(req.params.id))
//     if(index === -1){
//         return res.status(404).send("poduct not fond")
//     }
//     const deleted = products.splice(index , 1)
//     res.json(deleted[0])
//  })
 


// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//     console.log(process.env.PORT)
//     console.log(`Server running on port ${port}, http://localhost:${port}`)
// });
