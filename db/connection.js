const { Client } = require('pg');
const pass = require('./postgrespassword.js');

const client = new Client({
  user: 'postgres',
  password: pass,
  host: 'localhost',
  database: 'bestbuds',
  port: 5432,
});

client.connect();

module.exports = client;
