const { Pool } = require('pg');

// The DATABASE_URL environment variable is automatically injected by Render
// based on the configuration in render.yaml
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};