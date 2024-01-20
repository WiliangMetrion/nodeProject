const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const pg = require('./../db');

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  var data = await pg.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);
  console.log(data.rows);
  if (data.rows.length > 0) {
    res.status(200).json({
      status: 'success',
      message: "Anda berhasil login!",
      data : data.rows
    });
  } else {
    res.status(200).json({
      status: 'success',
      message: "Anda gagal login!",
    });
  }
});

exports.register = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  var lastAccount = await pg.query(`SELECT accountnumber FROM users ORDER BY accountnumber DESC LIMIT 1`);

  var count = +lastAccount.rows[0]['accountnumber'] + 1;
  var countString = String(count);
  var data = await pg.query(`
  INSERT INTO users (username, password, accountnumber)
  VALUES('${username}', '${password}', '${countString.padStart(7, '0')}')`);

    res.status(200).json({
      status: 'success',
      message: "User telah dibuat!",
    });
});