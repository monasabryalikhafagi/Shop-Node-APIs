const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);

module.exports = router;
