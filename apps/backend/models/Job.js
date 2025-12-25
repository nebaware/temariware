const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companySize: {
        type: DataTypes.ENUM('Startup', 'SME', 'Corporation', 'Government'),
        defaultValue: 'SME'
    },
    type: {
        type: DataTypes.ENUM('Internship', 'Part-time', 'Freelance', 'Full-time', 'Micro-task'),
        allowNull: false
    },
    location: {
        type: DataTypes.ENUM('Remote', 'On-site', 'Hybrid'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    salary: {
        type: DataTypes.STRING
    },
    salaryVal: {
        type: DataTypes.FLOAT
    },
    tags: {
        type: DataTypes.TEXT, // Stored as JSON string
        get() {
            const val = this.getDataValue('tags');
            return val ? JSON.parse(val) : [];
        },
        set(val) {
            this.setDataValue('tags', JSON.stringify(val));
        }
    },
    isGroupProject: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    applicantsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Job;

