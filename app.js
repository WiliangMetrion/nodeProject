const express = require('express');

const dotenv = require('dotenv');
dotenv.config()

const AppError = require('./utils/appError');
const loginRouter = require('./routes/loginRoutes');
const transaksiRouter = require('./routes/transaksiRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});

app.use('/login', loginRouter);
app.use('/transaksi', transaksiRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});



module.exports = app;