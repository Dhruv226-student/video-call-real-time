const express = require('express');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const chatRoutes = require('./chat.route');


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/chat', chatRoutes);
// router.use('/user', userRoutes);




module.exports = router;