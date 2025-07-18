
const userRoutes = require("./src/routes/usersRoutes")
const addressRouter = require('./src/routes/addressRouter');
const authRoutes = require('./src/routes/authRoute');
const productRoutes = require('./src/routes/productRoute');
const noticeRoutes = require('./src/routes/noticeRouter');
const enquiryRoutes = require('./src/routes/enquiryRouter');
 const testRouters = require('./src/routes/testRoutes');
 const newsRouters = require('./src/routes/newsRouter');
 const libraryRoutes = require( './src/controllers/library/libraryRoutes.js');


module.exports = {
    userRoutes,
    addressRouter,
    authRoutes,
    productRoutes,
    noticeRoutes,
    enquiryRoutes,
     testRouters,
     newsRouters,
     libraryRoutes
}