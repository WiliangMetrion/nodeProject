const express = require('express');
const transaksiController = require('./../controllers/transaksiController');

const router = express.Router();

router
  .route('/')
  .post(transaksiController.read);

router
  .route('/pie')
  .post(transaksiController.readPieData);

router
  .route('/receivables')
  .post(transaksiController.insertReceivable);

module.exports = router;
