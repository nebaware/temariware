const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dbPath = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dbPath, 'database.sqlite'),
  // Set logging to console.log in development, or disable it in production.
  // This is useful for debugging but can be noisy in production.
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

module.exports = { sequelize };
