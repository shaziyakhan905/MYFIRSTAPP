
const userRoutes = require("./src/routes/usersRoutes")
const addressRouter = require('./src/routes/addressRouter');
const authRoutes = require('./src/routes/authRoute');
const productRoutes = require('./src/routes/productRoute')

module.exports = {
    userRoutes,
    addressRouter,
    authRoutes,
    productRoutes
}