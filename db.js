const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "demonx",
    database: "MyFinance",
});

client.connect();

module.exports = client;