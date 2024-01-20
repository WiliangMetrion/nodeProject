const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const pg = require('./../db');

exports.read = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  var data = await pg.query(`
    SELECT username,
            pkuser,
            useraccount,
            pay_type,
            nominal,
            tanggal::DATE,
            category,
            pay_to,
            pay_to_acc
    FROM v_transaction WHERE username = '${username}'
    ORDER BY tanggal DESC`);

    res.status(200).json({
      status: 'success',
      message: "Data berhasil!",
      data : data.rows
    });
});

exports.readIncome = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  var data = await pg.query(`
    SELECT username,
            pkuser,
            useraccount,
            pay_type,
            nominal,
            tanggal::DATE,
            category,
            pay_to,
            pay_to_acc
    FROM v_transaction 
    WHERE username = '${username}' AND pay_type = 'Income'
    ORDER BY tanggal DESC`);

    res.status(200).json({
      status: 'success',
      message: "Data berhasil!",
      data : data.rows
    });
});

exports.readPayable = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  var data = await pg.query(`
    SELECT username,
            pkuser,
            useraccount,
            pay_type,
            nominal,
            tanggal::DATE,
            category,
            pay_to,
            pay_to_acc
    FROM v_transaction 
    WHERE username = '${username}' AND pay_type = 'Payable'
    ORDER BY tanggal DESC`);

    res.status(200).json({
      status: 'success',
      message: "Data berhasil!",
      data : data.rows
    });
});

exports.readReceivables = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  var data = await pg.query(`
    SELECT username,
            pkuser,
            useraccount,
            pay_type,
            nominal,
            tanggal::DATE,
            category,
            pay_to,
            pay_to_acc
    FROM v_transaction 
    WHERE username = '${username}' AND pay_type = 'Receivables'
    ORDER BY tanggal DESC`);

    res.status(200).json({
      status: 'success',
      message: "Data berhasil!",
      data : data.rows
    });
});

exports.readPieData = catchAsync(async (req, res, next) => {
    const { username } = req.body;
  
    var data = await pg.query(`
        SELECT username, pay_type, SUM(nominal) as Nominal
        FROM v_transaction
        WHERE username = '${username}'
        GROUP BY username, pay_type;`);
  
      res.status(200).json({
        status: 'success',
        message: "Data berhasil!",
        data : data.rows
      });
});

exports.insertReceivable = catchAsync(async (req, res, next) => {
    const { nominal, tanggal, fkuser, pay_to, pay_to_acc  } = req.body;
  
    await pg.query(`
        INSERT INTO t_transaction (
            category,
            nominal,
            tanggal,
            pay_type,
            fkuser,
            pay_to,
            pay_to_acc
        )
        VALUES 
        ('Receivables', ${nominal}, '${tanggal}'::DATE, 'Receviables', ${fkuser}, '${pay_to}', '${pay_to_acc}');
        
        UPDATE users SET saldo = saldo - ${nominal}, receivables = receivables + ${nominal} WHERE pkuser = ${fkuser};

        INSERT INTO m_tujuan (
          tujuan_name ,
          tujuan_acc,
          fkuser,
          remark
        )
        SELECT '${pay_to}' as tujuan_name, '${pay_to_acc}' as tujuan_acc, ${fkuser} as fkuser, '' as remark FROM m_tujuan
        WHERE NOT EXISTS (SELECT tujuan_name FROM m_tujuan WHERE tujuan_name = '${pay_to}') LIMIT 1 ;
        `);
  
      res.status(200).json({
        status: 'success',
        message: "Transaksi Receivables Berhasil!",
      });
});

exports.insertPayable = catchAsync(async (req, res, next) => {
    const { nominal, tanggal, fkuser, pay_to, pay_to_acc  } = req.body;
  
    await pg.query(`
        INSERT INTO t_transaction (
            category,
            nominal,
            tanggal,
            pay_type,
            fkuser,
            pay_to,
            pay_to_acc
        )
        VALUES 
        ('Payable', ${nominal}, '${tanggal}'::DATE, 'Payable', ${fkuser}, '${pay_to}', '${pay_to_acc}');
        
        UPDATE users SET saldo = saldo + ${nominal}, payable = payable + ${nominal} WHERE pkuser = ${fkuser};

        INSERT INTO m_tujuan (
          tujuan_name ,
          tujuan_acc,
          fkuser,
          remark
        )
        SELECT '${pay_to}' as tujuan_name, '${pay_to_acc}' as tujuan_acc, ${fkuser} as fkuser, '' as remark FROM m_tujuan
        WHERE NOT EXISTS (SELECT tujuan_name FROM m_tujuan WHERE tujuan_name = '${pay_to}') LIMIT 1 ;
        `);
  
      res.status(200).json({
        status: 'success',
        message: "Transaksi Payable Berhasil!",
      });
});

exports.insertIncome = catchAsync(async (req, res, next) => {
  const { nominal, tanggal, fkuser, pay_to, pay_to_acc  } = req.body;

  await pg.query(`
      INSERT INTO t_transaction (
          category,
          nominal,
          tanggal,
          pay_type,
          fkuser,
          pay_to,
          pay_to_acc
      )
      VALUES 
      ('Income', ${nominal}, '${tanggal}'::DATE, 'Income', ${fkuser}, '${pay_to}', '${pay_to_acc}');

      UPDATE users SET saldo = saldo + ${nominal}, income = income + ${nominal} WHERE pkuser = ${fkuser};
      `);

    res.status(200).json({
      status: 'success',
      message: "Transaksi Income Berhasil!",
    });
});

exports.insertTransaksi = catchAsync(async (req, res, next) => {
    const { category, nominal, tanggal, fkuser, pay_to, pay_to_acc  } = req.body;
  
    await pg.query(`
        INSERT INTO t_transaction (
            category,
            nominal,
            tanggal,
            pay_type,
            fkuser,
            pay_to,
            pay_to_acc
        )
        VALUES 
        ('${category}', ${nominal}, '${tanggal}'::DATE, 'Expense', ${fkuser}, '${pay_to}', '${pay_to_acc}');
        
        UPDATE users SET saldo = saldo - ${nominal}, expense = expense + ${nominal} WHERE pkuser = ${fkuser};

        INSERT INTO m_tujuan (
          tujuan_name ,
          tujuan_acc,
          fkuser,
          remark
        )
        SELECT '${pay_to}' as tujuan_name, '${pay_to_acc}' as tujuan_acc, ${fkuser} as fkuser, '' as remark FROM m_tujuan
        WHERE NOT EXISTS (SELECT tujuan_name FROM m_tujuan WHERE tujuan_name = '${pay_to}') LIMIT 1 ;
        `);
  
      res.status(200).json({
        status: 'success',
        message: "Transaksi Expense Berhasil!",
      });
});