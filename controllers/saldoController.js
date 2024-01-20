const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const pg = require('./../db');

exports.read = catchAsync(async (req, res, next) => {
  const { pkuser } = req.body;

  var data = await pg.query(`
        SELECT	username,
                saldo,
                expense,
                income,
                receivables,
                payable
        FROM users
        WHERE pkuser = ${pkuser};`);

    res.status(200).json({
      status: 'success',
      message: "Data berhasil!",
      data : data.rows
    });
});
