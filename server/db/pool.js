require('dotenv').config();

const { Pool } = require('pg');

const config = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
};

const prodConfig = {
  connectionString: process.env.PG_CONNECTION_STRING,
};

// ✍️ TODO 4: If PG_CONNECTION_STRING is available, use the prodConfig, otherwise use devConfig
const pool = prodConfig ? new Pool(prodConfig) : new Pool(config);
// const pool = new Pool(prodConfig);

module.exports = pool;
