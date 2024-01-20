const express = require('express');
const tujuanController = require('./../controllers/tujuanController');

const router = express.Router();

router
  .route('/')
  .post(tujuanController.read);

module.exports = router;
