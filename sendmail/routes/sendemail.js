const express = require('express');
const router = express.Router();
const controller = require('../controllers/SendEmailController');
const cors = require("cors");

router.post('/reserve', cors(), controller.reserveEmail);
router.post('/billpayment',cors(),controller.billPayment);

module.exports = router;