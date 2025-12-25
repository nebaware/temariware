const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const EkubGroup = sequelize.define('EkubGroup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    contributionAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    frequency: {
        type: DataTypes.ENUM('Weekly', 'Monthly'),
        defaultValue: 'Monthly'
    },
    maxMembers: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    membersCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    nextPayoutDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Active', 'Completed', 'Cancelled'),
        defaultValue: 'Active'
    },
    members: {
        type: DataTypes.TEXT, // JSON list of user IDs and their spots in the rotation
        get() {
            const val = this.getDataValue('members');
            return val ? JSON.parse(val) : [];
        },
        set(val) {
            this.setDataValue('members', JSON.stringify(val));
        }
    }
}, {
    timestamps: true
});

module.exports = EkubGroup;
