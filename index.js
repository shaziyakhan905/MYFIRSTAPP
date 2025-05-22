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
mongoose.connect(MONGODB_URI,{
   useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
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


const allRoutes = require('./routes');
app.use('/api/user', allRoutes.userRoutes);
const addressRouter = require('./routes/addressRouter');
app.use('/api/address', addressRouter);


