
export enum UserRole {
  STUDENT = 'STUDENT',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN'
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MODERATOR = 'MODERATOR',
  FINANCE = 'FINANCE',
  VERIFICATION = 'VERIFICATION',
  SUPPORT = 'SUPPORT'
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  endorsements?: number;
}

export interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | 'Behance' | 'Website' | 'Telegram';
  url: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string; // Live demo
  githubUrl?: string;
  thumbnail?: string; // Image URL
  images?: string[]; // Gallery
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'Credit' | 'Debit';
  description: string;
  date: string;
  method: 'Telebirr' | 'CBE Birr' | 'Wallet' | 'Ekub Payout';
  status: 'Completed' | 'Pending';
}

export interface EkubGroup {
  id: string;
  name: string;
  totalAmount: number;
  contributionAmount: number;
  frequency: 'Weekly' | 'Monthly';
  membersCount: number;
  maxMembers: number;
  nextPayoutDate: string;
  myStatus: 'Active' | 'Pending' | 'Not Joined';
}

export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer Received' | 'Rejected' | 'Accepted';

export interface UserApplication {
  jobId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  adminRole?: AdminRole; // For RBAC
  headline?: string;
  location?: string;
  university?: string;
  department?: string;
  batch?: string;
  graduationYear?: string;
  studentId?: string;
  nationalId?: string;
  isVerified: boolean;
  bio: string;
  skills: Skill[];
  projects: Project[];
  avatar: string;
  coverImage?: string;
  socialLinks?: SocialLink[];
  certifications?: Certification[];
  experience?: Experience[];
  educationHistory?: Education[];
  walletBalance: number;
  transactions: Transaction[];
  activeEkubs: string[];
  appliedJobs: UserApplication[];
  enrolledCourses?: string[];
  profileStrength?: number;
  views?: number;
  connections?: number;
  followers?: number;
  following?: number;
  xp?: number;
  level?: number;
  streak?: number;
  lastLogin?: string;
  dailyClaimed?: boolean;
  createdCourses?: string[];

  // Security & Safety
  is2FAEnabled?: boolean;
  twoFactorMethod?: 'TOTP' | 'SMS';
  phoneNumber?: string;
  riskScore?: number; // 0-100 (Fraud detection)
  isBanned?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companySize?: 'Startup' | 'SME' | 'Corporation' | 'Government';
  type: 'Internship' | 'Part-time' | 'Freelance' | 'Full-time' | 'Micro-task';
  location: 'Remote' | 'On-site' | 'Hybrid';
  description: string;
  salary: string;
  salaryVal?: number;
  postedAt: string;
  tags: string[];
  isGroupProject?: boolean;
  applicantsCount: number;
  status?: 'Pending' | 'Approved' | 'Rejected'; // Admin moderation
}

export interface JobFilters {
  datePosted: 'all' | '24h' | 'week' | 'month';
  salaryMin: number;
  salaryMax: number;
  companySize: string[];
  skills: string[];
}

export interface LiveSession {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  topic: string;
  startTime: string;
  isLive: boolean;
  participants: number;
  price: number;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  type: 'Event' | 'Tutorial' | 'Product' | 'General';
  timestamp: string;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  title: string;
  description: string;
  price: number;
  priceUnit: 'Fixed' | 'Hourly';
  category: 'Design' | 'Development' | 'Writing' | 'Marketing';
  rating: number;
  image: string;
}

export interface Notification {
  id: string;
  type: 'Job' | 'Wallet' | 'System' | 'Ekub';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  role: 'Editor' | 'Viewer';
  currentAction?: string;
}

export interface ExternalLink {
  title: string;
  url: string;
}

export interface Task {
  id: string;
  content: string;
  column: 'todo' | 'doing' | 'done';
  assignedTo?: string;
  tags: string[];
  externalLinks?: ExternalLink[];
  dueDate?: string;
  comments?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  attachment?: {
    name: string;
    type: 'image' | 'file';
    url?: string;
    size: string;
  };
}

export interface Story {
  id: string;
  user: string;
  avatar: string;
  image: string;
  isLive?: boolean;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  summary: string;
  time: string;
  image?: string;
  category: 'University' | 'Tech' | 'Scholarship';
}

export interface Course {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
  enrolledCount: number;
  modules: CourseModule[];
  level: string;
  duration: string;
  createdAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lecture[]; // Renamed from lectures to match usage
  quizzes: Quiz[];
}

export interface Lecture {
  id: string;
  title: string;
  videoUrl?: string; // Mock URL
  duration: string;
}

export interface Quiz {
  id: string;
  title: string;
  questionCount: number;
}

// --- Admin System Types ---

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  timestamp: string;
  details: string;
  ip: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  documentType: 'University ID' | 'National ID';
  documentUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string; // User ID, Job ID, or Post ID
  type: 'Spam' | 'Scam' | 'Harassment' | 'Inappropriate';
  description: string;
  status: 'Open' | 'Resolved' | 'Dismissed';
  timestamp: string;
}

export interface AdminStats {
  totalUsers: number;
  activeJobs: number;
  totalRevenue: number;
  serverHealth: number; // 0-100%
  liveConnections: number;
  pendingVerifications: number;
  flaggedContent: number;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Error';
}

export interface ChartPoint {
  time: string;
  value: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export type ResumeTemplate = 'modern' | 'classic' | 'minimal';

export type AppAction =
  | { type: 'LOGIN'; payload: UserProfile }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'ADD_CERTIFICATION'; payload: Certification }
  | { type: 'REMOVE_CERTIFICATION'; payload: string }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'APPLY_JOB'; payload: string }
  | { type: 'JOIN_EKUB'; payload: EkubGroup }
  | { type: 'CREATE_EKUB'; payload: EkubGroup }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'CLAIM_DAILY_REWARD' }
  | { type: 'CREATE_COURSE'; payload: Course }
  | { type: 'ENROLL_COURSE'; payload: string }
  | { type: 'SET_JOBS'; payload: Job[] } // New: for async fetching
  | { type: 'SET_EKUBS'; payload: EkubGroup[] }
  | { type: 'SEND_MESSAGE'; payload: { conversationId: string, text: string } }
  | { type: 'RECEIVE_MESSAGE'; payload: { senderId: string, text: string } }
  // Admin Actions
  | { type: 'VERIFY_USER'; payload: string }
  | { type: 'BAN_USER'; payload: string }
  | { type: 'APPROVE_JOB'; payload: string }
  | { type: 'REJECT_JOB'; payload: string }
  | { type: 'RESOLVE_REPORT'; payload: string };

export interface GlobalState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  jobs: Job[];
  ekubs: EkubGroup[];
  notifications: Notification[];
  liveSessions: LiveSession[];
  newsFeed: NewsItem[];
  stories: Story[];
  courses: Course[];
  // Admin State
  auditLogs: AuditLog[];
  verificationRequests: VerificationRequest[];
  reports: Report[];
  allUsers: UserProfile[];
  conversations: Conversation[];
}

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    am: string;
  }
}
