const express= require('express');
const { protectRoute } = require('../middlewares/auth');
const { userController } = require('../controller');


const router = express.Router();

router.use(protectRoute);

router.get('/',userController.getRecommendedUsers);

router.get('/friends',userController.getMyFriends);


router.post('/friend-request/:userId',userController.sendFriendRequest);

router.put('/friend-request-accept/:id',userController.acceptFriendRequest);
router.get("/friend-requests" , userController.getFriendRequests);
router.get('/outgoing-friend-requests',userController.getOutgoingFriendRequests);

module.exports = router;