const express = require('express');
const saldoController = require('./../controllers/saldoController');

const router = express.Router();

router
  .route('/')
  .post(saldoController.read);

module.exports = router;
