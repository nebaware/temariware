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
  logging: false
});

module.exports = { sequelize };