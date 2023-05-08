const express = require('express');
const { signup, logins, verifyToken, getUser, refreshToken } = require('../controller/MainController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', logins)
router.get('/user', verifyToken, getUser);
router.get('/refresh', refreshToken,verifyToken, getUser)
module.exports = router