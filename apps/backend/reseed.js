const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/db');
const User = require('./models/User');

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        await sequelize.query("DELETE FROM Users WHERE email = 'admin@temariware.com'");
        await sequelize.query("DELETE FROM Users WHERE email = 'student@temariware.com'");
        await sequelize.query("DELETE FROM Users WHERE email = 'nebaware@gmail.com'");
        await sequelize.query("DELETE FROM Users WHERE email = 'temari@gmail.com'");

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@temariware.com',
            password: 'Password123',
            university: 'AAU',
            role: 'ADMIN'
        });

        const student = await User.create({
            name: 'Student User',
            email: 'student@temariware.com',
            password: 'Password123',
            university: 'AAU',
            role: 'STUDENT'
        });

        await User.create({
            name: 'Neba User',
            email: 'nebaware@gmail.com',
            password: 'Password123',
            university: 'AAU',
            role: 'STUDENT'
        });

        await User.create({
            name: 'Temari User',
            email: 'temari@gmail.com',
            password: 'Password123',
            university: 'AAU',
            role: 'STUDENT'
        });

        console.log('✅ Users re-seeded');
        console.log('Admin password hash:', admin.password);

        const match = await bcrypt.compare('Password123', admin.password);
        console.log('Test match Password123:', match);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
