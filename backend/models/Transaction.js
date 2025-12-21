const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Credit', 'Debit'),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    method: {
        type: DataTypes.ENUM('Telebirr', 'CBE Birr', 'Wallet', 'Ekub Payout'),
        defaultValue: 'Wallet'
    },
    status: {
        type: DataTypes.ENUM('Completed', 'Pending'),
        defaultValue: 'Completed'
    }
}, {
    timestamps: true
});

module.exports = Transaction;
