const express = require('express');
const controller = require('../controller/index');
const auth = require('../middleware/auth')

const router = express.Router();
/* GET home page. */
router.get('/', controller.getRoot);

/* GET CUMMULATIVE OCCURENCE */
router.get('/present', controller.getCummulativeData);

/* GET CUMMULATIVE OCCURENCE */
router.get('/national', controller.getCummulativeNational);

/* GET PER STATE OCCURENCE */
router.get('/state/:state', controller.getByState);

/* GET PER REGION OCCURENCE */
router.get('/region/:region', controller.getByRegion);


/* POST data */
router.post('/', auth, controller.postData);

/* EDIT POST */
router.put('/', auth, controller.putData);

module.exports = router;
