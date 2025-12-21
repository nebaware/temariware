const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  university: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('STUDENT', 'EMPLOYER', 'ADMIN', 'Student', 'Instructor', 'Admin'),
    defaultValue: 'STUDENT'
  },
  adminRole: {
    type: DataTypes.ENUM('SUPER_ADMIN', 'MODERATOR', 'FINANCE', 'VERIFICATION', 'SUPPORT'),
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  headline: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  batch: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  graduationYear: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  studentId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  nationalId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  coverImage: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  phoneNumber: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  skills: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('skills');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('skills', JSON.stringify(val));
    }
  },
  projects: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('projects');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('projects', JSON.stringify(val));
    }
  },
  socialLinks: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('socialLinks');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('socialLinks', JSON.stringify(val));
    }
  },
  certifications: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('certifications');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('certifications', JSON.stringify(val));
    }
  },
  experience: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('experience');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('experience', JSON.stringify(val));
    }
  },
  educationHistory: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('educationHistory');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('educationHistory', JSON.stringify(val));
    }
  },
  walletBalance: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  appliedJobs: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('appliedJobs');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('appliedJobs', JSON.stringify(val));
    }
  },
  activeEkubs: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('activeEkubs');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('activeEkubs', JSON.stringify(val));
    }
  },
  enrolledCourses: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('enrolledCourses');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('enrolledCourses', JSON.stringify(val));
    }
  },
  createdCourses: {
    type: DataTypes.TEXT, // JSON string
    get() {
      const val = this.getDataValue('createdCourses');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('createdCourses', JSON.stringify(val));
    }
  },
  profileStrength: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  connections: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dailyClaimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;