
import { UserProfile, UserRole, AdminRole, Job, LiveSession, Post, Service, EkubGroup, Notification, Collaborator, Task, ChatMessage, TranslationDictionary, Story, NewsItem, AdminStats, SystemLog, Course, AuditLog, VerificationRequest, Report, Conversation } from './types';

// Ethiopian Universities (Comprehensive List - 45+ institutions)
export const UNIVERSITIES = [
  "Addis Ababa University (AAU)",
  "Addis Ababa Science and Technology University (AASTU)",
  "Adama Science and Technology University (ASTU)",
  "Jimma University (JU)",
  "Bahir Dar University (BDU)",
  "Mekelle University (MU)",
  "Hawassa University (HU)",
  "University of Gondar (UoG)",
  "Haramaya University",
  "Arba Minch University (AMU)",
  "Wollo University",
  "Dilla University",
  "Debre Berhan University (DBU)",
  "Debre Markos University (DMU)",
  "Wolaita Sodo University (WSU)",
  "Aksum University",
  "Adigrat University",
  "Bule Hora University",
  "Dire Dawa University (DDU)",
  "Ethiopian Civil Service University",
  "Madda Walabu University",
  "Mizan Tepi University",
  "Samara University",
  "Wachemo University",
  "Wolkite University",
  "Assosa University",
  "Debre Tabor University",
  "Jigjiga University",
  "Metu University",
  "Kebri Dehar University",
  "Ambo University",
  "Debark University",
  "Injibara University",
  "Raya University",
  "Unity University",
  "St. Mary's University",
  "Admas University",
  "Royal University College",
  "Alpha University College",
  "Nile College",
  "Rift Valley University",
  "Mekane Yesus Management and Leadership College",
  "Microlink Information Technology College",
  "Hope University College",
  "New Generation University College",
  "Other (Please specify)"
];

export const DICTIONARY: TranslationDictionary = {
  'Home': { en: 'Home', am: 'ቤት' },
  'Work': { en: 'Work', am: 'ስራ' },
  'Gebeta': { en: 'Gebeta', am: 'ገበታ' },
  'Wallet': { en: 'Wallet', am: 'ቦርሳ' },
  'Me': { en: 'Me', am: 'እኔ' },
  'Discover': { en: 'Discover', am: 'ያስሱ' },
  'Network': { en: 'Network', am: 'ኔትወርክ' },
  'Apply': { en: 'Apply', am: 'አመልክት' },
  'Applied': { en: 'Applied', am: 'ተመልክቷል' },
  'Join': { en: 'Join', am: 'ተቀላቀል' },
  'Live': { en: 'Live', am: 'ቀጥታ' },
  'Edit': { en: 'Edit', am: 'አስተካክል' },
  'Save': { en: 'Save', am: 'አስቀምጥ' },
  'Deposit': { en: 'Deposit', am: 'ገንዘብ አስገባ' },
  'Withdraw': { en: 'Withdraw', am: 'ገንዘብ አውጣ' },
  'Find Work': { en: 'Find Work', am: 'ስራ ይፈልጉ' },
  'Virtual Campus': { en: 'Virtual Campus Learning Hub', am: 'የቨርቹዋል ግቢ መማሪያ' },
  'Total Balance': { en: 'Total Balance', am: 'ጠቅላላ ቀሪ ሂሳብ' },
  'Recent Transactions': { en: 'Recent Transactions', am: 'የቅርብ ግብይቶች' },
  'My Circles': { en: 'My Circles', am: 'የእኔ እቁቦች' },
  'Start New Circle': { en: 'Start New Circle', am: 'አዲስ እቁብ ጀምር' },
};

export const MOCK_USER: UserProfile = {
  id: "u1",
  name: "Abebe Kebede",
  headline: "Full Stack Developer | CS Senior @ AAU",
  location: "Addis Ababa, Ethiopia",
  email: "abebe@aau.edu.et",
  phoneNumber: "+251911223344",
  role: UserRole.STUDENT,
  university: "Addis Ababa University",
  department: "Software Engineering",
  batch: "2016 E.C.",
  graduationYear: "2024",
  studentId: "UGR/1234/13",
  nationalId: "NID-998877",
  isVerified: true,
  bio: "Passionate developer specializing in React and Node.js. I build scalable web applications and am currently looking for internship opportunities in FinTech. Lead of the AAU Coding Club.",
  skills: [
    { name: "React", level: "Expert", endorsements: 12 },
    { name: "TypeScript", level: "Intermediate", endorsements: 5 },
    { name: "Python", level: "Beginner", endorsements: 2 },
    { name: "UI/UX", level: "Intermediate", endorsements: 8 }
  ],
  projects: [
    {
      id: "p1",
      title: "TeleHealth Et",
      description: "A telemedicine app connecting rural clinics to specialists in Addis Ababa using WebRTC.",
      technologies: ["React", "Firebase", "WebRTC"],
      link: "https://telehealth-et.demo",
      githubUrl: "https://github.com/abebe/telehealth",
      thumbnail: "https://placehold.co/600x400/0F766E/ffffff?text=TeleHealth+App"
    },
    {
      id: "p2",
      title: "Gebeta Food Delivery",
      description: "A prototype UI for a local food delivery service focusing on traditional foods.",
      technologies: ["Figma", "Flutter"],
      link: "https://behance.net/abebe/gebeta",
      thumbnail: "https://placehold.co/600x400/F59E0B/ffffff?text=Gebeta+UI"
    }
  ],
  experience: [
    {
      id: "ex1",
      role: "Frontend Developer Intern",
      company: "Ahadoo Tec",
      duration: "Jun 2023 - Sep 2023",
      description: "Developed UI components for the main dashboard using React and Tailwind CSS."
    }
  ],
  educationHistory: [
    {
      id: "edu1",
      institution: "Addis Ababa University",
      degree: "BSc",
      fieldOfStudy: "Software Engineering",
      startDate: "2020",
      endDate: "2024"
    }
  ],
  avatar: "https://ui-avatars.com/api/?name=Abebe+Kebede&background=0F766E&color=fff",
  coverImage: "https://placehold.co/800x200/111827/0F766E?text=Code+Like+A+Pro",
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/abebe' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/abebe' },
    { platform: 'Telegram', url: 'https://t.me/abebe_dev' }
  ],
  certifications: [
    { id: 'c1', name: 'Google UX Design Professional Certificate', issuer: 'Coursera', date: '2023' },
    { id: 'c2', name: 'Meta Frontend Developer', issuer: 'Meta', date: '2022' }
  ],
  walletBalance: 2450.00,
  transactions: [
    { id: "t1", amount: 200, type: "Credit", description: "Logo Design Payment", date: "2023-10-12", method: "Telebirr", status: "Completed" },
    { id: "t2", amount: 50, type: "Debit", description: "Gebeta Class Fee", date: "2023-10-10", method: "Wallet", status: "Completed" }
  ],
  activeEkubs: ["e1"],
  appliedJobs: [],
  enrolledCourses: [],
  profileStrength: 85,
  views: 124,
  connections: 87,
  followers: 342,
  following: 120,
  xp: 1250,
  level: 5,
  streak: 3,
  is2FAEnabled: false,
  riskScore: 5
};

export const MOCK_EKUBS: EkubGroup[] = [{ id: "e1", name: "Laptop Savers", totalAmount: 50000, contributionAmount: 2000, frequency: 'Monthly', membersCount: 8, maxMembers: 12, nextPayoutDate: "Oct 30, 2023", myStatus: 'Active' }];
export const MOCK_NOTIFICATIONS: Notification[] = [{ id: "n1", type: "Ekub", title: "Ekub Payout Soon", message: "Laptop Savers payout is in 3 days.", time: "2m ago", read: false }];
export const MOCK_LIVE_SESSIONS: LiveSession[] = [{ id: "ls1", title: "Final Exam Prep", hostName: "Dawit Tech", hostAvatar: "https://ui-avatars.com/api/?name=Dawit", topic: "Exam Prep", startTime: new Date().toISOString(), isLive: true, participants: 142, price: 0 }];
export const MOCK_POSTS: Post[] = [
  { id: "p1", author: "Abebe Kebede", avatar: "https://ui-avatars.com/api/?name=Abebe+Kebede&background=0F766E&color=fff", content: "Just finished the React course! Highly recommended.", image: "", likes: 12, type: "General", timestamp: "2h ago" }
];
export const MOCK_SERVICES: Service[] = [{ id: "s1", providerId: "u2", providerName: "Hana D.", providerAvatar: "", title: "Business cards", description: "Design", price: 300, priceUnit: "Fixed", category: "Design", rating: 4.9, image: "https://placehold.co/300x200" }];
export const MOCK_COLLABORATORS: Collaborator[] = [{ id: "c1", name: "Kalkidan", avatar: "", color: "#EC4899", isOnline: true, role: 'Editor' }];
export const MOCK_PROJECT_TASKS: Task[] = [{ id: "t1", content: "Design UI", column: "doing", assignedTo: "c1", tags: ["UI"], comments: [] }];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [];
export const MOCK_STORIES: Story[] = [];
export const MOCK_NEWS_FEED: NewsItem[] = [];

export const MOCK_JOBS: Job[] = [
  {
    id: "j1",
    title: "Frontend Intern",
    company: "Ride Ethiopia",
    companySize: "Startup",
    type: "Internship",
    location: "Hybrid",
    description: "Assist our team in building the next gen dispatch dashboard. Must know React.",
    salary: "4000 ETB/mo",
    salaryVal: 4000,
    postedAt: "2 days ago",
    tags: ["React", "Web"],
    isGroupProject: false,
    applicantsCount: 12,
    status: 'Approved'
  },
  {
    id: "j5",
    title: "Sketchy Gig",
    company: "Unknown",
    companySize: "Startup",
    type: "Freelance",
    location: "Remote",
    description: "Earn $1000/day working from home. Contact via Telegram @sketchy.",
    salary: "50,000 ETB",
    salaryVal: 50000,
    postedAt: "1 hour ago",
    tags: ["Easy Money"],
    isGroupProject: false,
    applicantsCount: 0,
    status: 'Pending'
  }
];

export const DISCOVER_USERS: UserProfile[] = [
  { ...MOCK_USER, id: "u2", name: "Sara Tadesse", headline: "UI/UX Designer", role: UserRole.STUDENT, riskScore: 10 },
  { ...MOCK_USER, id: "u3", name: "Michael Belay", headline: "Backend Dev", role: UserRole.STUDENT, riskScore: 2 },
  { ...MOCK_USER, id: "u4", name: "Scammer One", headline: "Money Doubler", role: UserRole.STUDENT, riskScore: 95, isBanned: false }
];

export const MOCK_ADMIN_STATS: AdminStats = { totalUsers: 2450, activeJobs: 142, totalRevenue: 450000, serverHealth: 98, liveConnections: 345, pendingVerifications: 12, flaggedContent: 5 };
export const MOCK_SYSTEM_LOGS: SystemLog[] = [{ id: 'l1', action: 'User Registration', user: 'New User', timestamp: 'Just now', status: 'Success' }];
export const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    instructorId: "u2",
    instructorName: "Sara Tadesse",
    instructorAvatar: "https://ui-avatars.com/api/?name=Sara+Tadesse&background=random",
    title: "Intro to UI/UX Design with Figma",
    description: "Learn the basics of User Interface and User Experience design using Figma. Perfect for beginners.",
    price: 500,
    category: "Design",
    thumbnail: "https://placehold.co/600x400/EC4899/ffffff?text=UI+UX+Course",
    rating: 4.8,
    enrolledCount: 120,
    level: "Beginner",
    duration: "4 weeks",
    createdAt: "2023-10-01",
    modules: [
      { id: "m1", title: "Introduction", lessons: [], quizzes: [] },
      { id: "m2", title: "Wireframing", lessons: [], quizzes: [] }
    ]
  }
];
export const MOCK_AUDIT_LOGS: AuditLog[] = [{ id: 'al1', adminId: 'u1', action: 'BAN_USER', targetId: 'u99', timestamp: '2023-10-25 10:00', details: 'User banned for spamming job board.', ip: '192.168.1.5' }];
export const MOCK_VERIFICATIONS: VerificationRequest[] = [{ id: 'vr1', userId: 'u5', userName: 'Dawit Alemu', documentType: 'University ID', documentUrl: 'https://placehold.co/600x400/333/fff?text=ID+Card', status: 'Pending', submittedAt: '2023-10-24' }];
export const MOCK_REPORTS: Report[] = [{ id: 'r1', reporterId: 'u2', targetId: 'j5', type: 'Scam', description: 'Job asks for payment before interview.', status: 'Open', timestamp: '1 hour ago' }];

export const MOCK_CODE_FILES = {
  'App.tsx': `import React from 'react';\n\nconst App = () => {\n  return <div>Hello Ethiopia!</div>;\n}\n\nexport default App;`,
  'types.ts': `export interface User {\n  id: string;\n  name: string;\n}`,
  'utils.ts': `export const sum = (a: number, b: number) => a + b;`
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    participants: [
      { id: "u1", name: "Abebe Kebede", avatar: "https://ui-avatars.com/api/?name=Abebe+Kebede&background=0F766E&color=fff" },
      { id: "u2", name: "Sara Tadesse", avatar: "https://ui-avatars.com/api/?name=Sara+Tadesse&background=random" }
    ],
    lastMessage: "Hey, are you going to the hackathon?",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "u2", text: "Hey, are you going to the hackathon?", timestamp: "10:30 AM", read: false }
    ]
  }
];
