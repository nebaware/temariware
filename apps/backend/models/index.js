const User = require('./User');
const Job = require('./Job');
const Transaction = require('./Transaction');
const Course = require('./Course');
const EkubGroup = require('./EkubGroup');
const Message = require('./Message');
const Subscription = require('./Subscription');

// Define Relationships

// User & Jobs
User.hasMany(Job, { foreignKey: 'createdBy', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'createdBy', as: 'author' });

// User & Transactions
User.hasMany(Transaction, { foreignKey: 'userId', as: 'financialHistory' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// User & Courses (Instructor)
User.hasMany(Course, { foreignKey: 'instructorId', as: 'taughtCourses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// User & Subscriptions
User.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    User,
    Job,
    Transaction,
    Course,
    EkubGroup,
    Message,
    Subscription
};
