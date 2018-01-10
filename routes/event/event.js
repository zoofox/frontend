var express = require('express');
var router = express.Router();
var newyearController = require('../../controllers/event/201801/newyearController');

router.get('/201801/newyear', newyearController.renderPage);

module.exports = router;
