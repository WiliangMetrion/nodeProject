const express = require('express');
const loginController = require('./../controllers/loginController');

const router = express.Router();

router
  .route('/')
  .post(loginController.login);

router
  .route('/create')
  .post(loginController.register);

module.exports = router;
