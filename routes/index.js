// Initialize dependencies 
const router = require('express').Router();
const apiRoutes = require('./api-routes');

router.use('/api', apiRoutes);
router.use((req, res) => {
    return res.status(404).res.send('Wrong route!');
});

module.exports = router;