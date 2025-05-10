const express = require('express');
const authController = require('../controller/auth.controller');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validation');


const router = express.Router();

router.post('/signup', validate(authValidation.signup) ,authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);



module.exports = router;