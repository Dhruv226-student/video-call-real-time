const express = require('express');
const authController = require('../controller/auth.controller');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validation');
const { protectRoute } = require('../middlewares/auth');


const router = express.Router();

router.post('/signup', validate(authValidation.signup) ,authController.signup);
router.post('/login', validate(authValidation.login),authController.login);
router.post('/logout', authController.logout);
router.get('/me', protectRoute, (req, res) => {
    res.status(200).json(
            {user:req.user})
});

router.post('/onboarding',protectRoute,validate(authValidation.onboarding),authController.onboarding);



module.exports = router;