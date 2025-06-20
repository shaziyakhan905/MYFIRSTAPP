require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const allRoutes = require('./routes');
const app = express();
const authenticate = require('./src/middlewares/authMiddleware');
const errorHandler = require('./src/middlewares/errorHandler');
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

app.use('/api/user',authenticate.authenticateToken , allRoutes.userRoutes);
app.use('/api', allRoutes.authRoutes);
app.use('/api/address', allRoutes.addressRouter);
app.use('/api/product',authenticate.authenticateToken, allRoutes.productRoutes);
app.use('/api/notice',authenticate.authenticateToken, allRoutes.noticeRoutes);
app.use('/api',authenticate.authenticateToken, allRoutes.enquiryRoutes);
app.use('/api/test', allRoutes.testRouters);
app.use('/api/news', allRoutes.newsRouters);

// Global error handler (must be last)
app.use(errorHandler);
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
  next(err);
});