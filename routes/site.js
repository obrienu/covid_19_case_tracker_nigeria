const express = require('express');
const UserController = require('../controller/site');
// const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', UserController.getHome);
router.get('/stat', UserController.getStat);
router.get('/login', UserController.getLogin);
router.get('/updates', UserController.getPostData);
router.get('/register', UserController.getRegister);


module.exports = router;
