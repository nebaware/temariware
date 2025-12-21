const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    tier: {
        type: DataTypes.ENUM('FREE', 'PRO', 'ENTERPRISE'),
        defaultValue: 'FREE'
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING'),
        defaultValue: 'ACTIVE'
    },
    startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    autoRenew: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Subscription;
