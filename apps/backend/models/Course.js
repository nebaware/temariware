const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    instructorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5.0
    },
    enrolledCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    modules: {
        type: DataTypes.TEXT, // JSON string for modules, lectures, quizzes
        get() {
            const val = this.getDataValue('modules');
            return val ? JSON.parse(val) : [];
        },
        set(val) {
            this.setDataValue('modules', JSON.stringify(val));
        }
    }
}, {
    timestamps: true
});

module.exports = Course;
