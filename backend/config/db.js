const { Sequelize } = require('sequelize');

// Use PostgreSQL in production, SQLite in development
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './data/database.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    });

module.exports = { sequelize };
