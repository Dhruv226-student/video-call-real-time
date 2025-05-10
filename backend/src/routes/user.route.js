const express= require('express');
const { protectRoute } = require('../middlewares/auth');
const { userController } = require('../controller');


const router = express.Router();

router.use(protectRoute);

router.get('/',userController.getRecommendedUsers);

router.get('/friends',userController.getMyFriends);


router.get('/friend-requests/:id',userController.sendFriendRequest);

router.put('/friend-request-accept/:id',userController.acceptFriendRequest);
router.get("/friend-reuests" , userController.getFriendRequests);
router.get('/outgoing-friend-requests',userController.getOutgoingFriendRequests);

module.exports = router;