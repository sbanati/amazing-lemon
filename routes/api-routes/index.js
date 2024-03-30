const router = require('express').Router();

// Imoporting the user and thought routes
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

//Define the endpoints for user and thought routes
router.use('/user', userRoutes);
router.use('/thought', thoughtRoutes);

//export the router
module.exports = router;