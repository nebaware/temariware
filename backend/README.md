# TemariWare Backend API

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job posting
- `POST /api/jobs/:id/apply` - Apply to job

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `POST /api/courses/:id/enroll` - Enroll in course

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/send` - Send money
- `GET /api/wallet/transactions` - Get transaction history

### Messages
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

## Database Models

### User
- name, email, password
- university, department, batch
- role (Student, Instructor, Admin)
- profile data (bio, skills, experience, education)
- wallet balance and transactions
- enrolled courses and applied jobs

## TODO
- [ ] Implement MongoDB connection
- [ ] Add JWT authentication middleware
- [ ] Implement password hashing with bcrypt
- [ ] Add input validation
- [ ] Implement remaining route handlers
- [ ] Add error handling
- [ ] Add rate limiting
- [ ] Add API documentation (Swagger)
