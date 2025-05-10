
const express = require('express');
const { protectRoute } = require('../middlewares/auth');
const { chatController } = require('../controller');


const router = express.Router();


router.get("/token" , protectRoute, chatController.getStreamToken)


module.exports = router;