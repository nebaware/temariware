const { sequelize } = require('./config/db');
const { User, Job, Course } = require('./models');

const sampleJobs = [
  {
    title: 'Frontend Developer',
    description: 'Build modern web applications with React and TypeScript',
    salary: '15000 ETB',
    type: 'Full-time',
    location: 'Addis Ababa',
    company: 'TechCorp Ethiopia',
    requirements: 'React, TypeScript, 2+ years experience',
    status: 'Approved'
  },
  {
    title: 'Backend Developer',
    description: 'Develop scalable APIs and microservices',
    salary: '18000 ETB',
    type: 'Full-time',
    location: 'Remote',
    company: 'StartupHub',
    requirements: 'Node.js, PostgreSQL, REST APIs',
    status: 'Approved'
  },
  {
    title: 'UI/UX Designer',
    description: 'Design user-friendly interfaces and experiences',
    salary: '12000 ETB',
    type: 'Part-time',
    location: 'Addis Ababa',
    company: 'Design Studio',
    requirements: 'Figma, Adobe Creative Suite, Portfolio',
    status: 'Approved'
  },
  {
    title: 'Data Entry Clerk',
    description: 'Accurate data entry and document processing',
    salary: '5000 ETB',
    type: 'Part-time',
    location: 'Bahir Dar',
    company: 'Business Solutions',
    requirements: 'MS Office, Attention to detail',
    status: 'Approved'
  },
  {
    title: 'Mobile App Developer',
    description: 'Build cross-platform mobile applications',
    salary: '20000 ETB',
    type: 'Contract',
    location: 'Remote',
    company: 'MobileTech',
    requirements: 'React Native, Flutter, Mobile development',
    status: 'Approved'
  }
];

const sampleCourses = [
  {
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, JavaScript from scratch',
    instructor: 'John Doe',
    duration: '8 weeks',
    price: 2000,
    level: 'Beginner',
    category: 'Programming'
  },
  {
    title: 'React Advanced Patterns',
    description: 'Master advanced React concepts and patterns',
    instructor: 'Jane Smith',
    duration: '6 weeks',
    price: 3500,
    level: 'Advanced',
    category: 'Programming'
  },
  {
    title: 'Digital Marketing Essentials',
    description: 'Complete guide to digital marketing strategies',
    instructor: 'Mike Johnson',
    duration: '4 weeks',
    price: 1500,
    level: 'Beginner',
    category: 'Marketing'
  },
  {
    title: 'Data Science with Python',
    description: 'Learn data analysis and machine learning',
    instructor: 'Sarah Wilson',
    duration: '12 weeks',
    price: 5000,
    level: 'Intermediate',
    category: 'Data Science'
  }
];

const sampleUsers = [
  {
    name: 'Demo Student',
    email: 'demo@student.com',
    password: 'password123',
    university: 'Addis Ababa University',
    role: 'STUDENT',
    isVerified: true,
    walletBalance: 2500,
    level: 3,
    xp: 1200
  },
  {
    name: 'Test Employer',
    email: 'employer@company.com',
    password: 'password123',
    university: 'Business School',
    role: 'EMPLOYER',
    isVerified: true,
    walletBalance: 50000,
    level: 5,
    xp: 2500
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Sync database
    await sequelize.sync({ force: false });
    
    // Seed Users
    console.log('👥 Seeding users...');
    for (const userData of sampleUsers) {
      await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });
    }
    
    // Seed Jobs
    console.log('💼 Seeding jobs...');
    for (const jobData of sampleJobs) {
      await Job.findOrCreate({
        where: { title: jobData.title, company: jobData.company },
        defaults: jobData
      });
    }
    
    // Seed Courses
    console.log('📚 Seeding courses...');
    for (const courseData of sampleCourses) {
      await Course.findOrCreate({
        where: { title: courseData.title },
        defaults: courseData
      });
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created: ${sampleUsers.length} users, ${sampleJobs.length} jobs, ${sampleCourses.length} courses`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run seeding
seedDatabase();