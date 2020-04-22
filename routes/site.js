const express = require('express');
const UserController = require('../controller/site');
// const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', UserController.getHome);
router.get('/stat', UserController.getStat);


module.exports = router;
