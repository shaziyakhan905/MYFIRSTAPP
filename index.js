require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const allRoutes = require('./routes');
const app = express();
const authenticate = require('./src/middlewares/authMiddleware');

//Middlewares
app.use(express.json()); // to parse JSON body
app.use(bodyParser.json()); // for parsing application/json
app.use(cors());

//Environments variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Database Connection
mongoose.connect(MONGODB_URI,{
   useNewUrlParser: true,
  useUnifiedTopology: true,
  
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

  
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//Api Routes configurations
app.use('/api/user',authenticate, allRoutes.userRoutes);
app.use('/api', allRoutes.authRoutes);
app.use('/api/address', allRoutes.addressRouter);
app.use('/api/product',authenticate, allRoutes.productRoutes);