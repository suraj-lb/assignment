const express = require('express');
const router = express.Router();
const {validateUser} = require('../middleware/validation');
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

// User Registerration 
router.post('/register',validateUser, userController.signup)
// User login
router.post('/login', userController.login)
// Get All User api 
router.get('/lists', verifyToken, userController.list)
// Update User
router.put('/update', verifyToken, userController.update)
// Search User
router.get('/search', verifyToken, userController.search)

module.exports = router; 