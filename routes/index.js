const router = require('express').Router()

//! Default Route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome To PG-Dekho Test Server v1' });
});

//! User Route
router.use('/', require('./itemRoutes'))





module.exports = router