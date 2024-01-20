const express = require('express');
const transaksiController = require('./../controllers/transaksiController');

const router = express.Router();

router
  .route('/')
  .post(transaksiController.read);

router
  .route('/read/income')
  .post(transaksiController.readIncome);

  router
  .route('/read/payable')
  .post(transaksiController.readPayable);

  router
  .route('/read/receivables')
  .post(transaksiController.readReceivables);

  router
  .route('/insert/income')
  .post(transaksiController.insertIncome);

router
  .route('/pie')
  .post(transaksiController.readPieData);

router
  .route('/insert/receivables')
  .post(transaksiController.insertReceivable);

router
  .route('/insert/payable')
  .post(transaksiController.insertPayable);

router
  .route('/insert/expense')
  .post(transaksiController.insertTransaksi);

module.exports = router;
