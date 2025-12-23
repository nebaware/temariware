# TemariWare - Complete Student Ecosystem Platform

🚀 **Live Platform**: [https://temariware-frontend-exz5.onrender.com](https://temariware-frontend-exz5.onrender.com)  
🔧 **Backend API**: [https://temariware-backend-cqpb-exz5.onrender.com](https://temariware-backend-cqpb-exz5.onrender.com)  
📱 **Telegram Bot**: Search `@YourBotName` on Telegram  
🧪 **API Test Suite**: Open `test-suite.html` in browser

## 🌟 Features

### 🔐 Authentication & Security
- User registration/login with JWT tokens
- Password change functionality
- Role-based access control (Student, Admin)
- Session management with Redis

### 👤 User Management
- Complete profile system
- User discovery and networking
- Admin controls (ban/unban users)
- Profile strength tracking

### 💼 Job Marketplace
- Job listings with filtering
- Application system
- Admin job moderation
- Real-time job updates

### 💰 Wallet System
- ETB balance tracking
- Transaction history
- M-Pesa integration ready
- Real-time balance updates

### 📚 Learning Platform (Gebeta)
- Course creation and enrollment
- Interactive learning modules
- Progress tracking
- Instructor tools

### 💬 Real-time Communication
- Live messaging system
- Push notifications
- Socket.io integration
- Telegram bot integration

### 🤝 Ekub (Savings Groups)
- Create and join savings groups
- Automated rotation system
- Contribution tracking
- Group management

### 📱 Telegram Mini App
- Native Telegram integration
- Bot commands and interactions
- Web app button access
- Real-time sync with main platform

## 🚀 Quick Start

### Web Platform
1. Visit: [https://temariware-frontend-exz5.onrender.com](https://temariware-frontend-exz5.onrender.com)
2. Register or login
3. Complete your profile
4. Start exploring jobs, courses, and networking!

### Telegram Bot
1. Search for your bot on Telegram
2. Send `/start` to begin
3. Click "🚀 Open TemariWare" for mini app
4. Use commands: `/jobs`, `/wallet`, `/profile`, `/help`

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis server
- Telegram Bot Token

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
npm install
npm run dev
```

### Telegram Bot Setup
```bash
cd telegram-bot
npm install
# Set TELEGRAM_BOT_TOKEN in .env
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/discover` - Discover users
- `POST /api/users/change-password` - Change password

### Jobs
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job
- `POST /api/jobs/:id/apply` - Apply to job

### Wallet
- `GET /api/wallet/balance` - Get balance
- `GET /api/wallet/transactions` - Get transactions
- `POST /api/wallet/send` - Send money

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/:id/read` - Mark as read

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
CORS_ORIGIN=https://your-frontend-url.com
```

### Telegram Bot (.env)
```env
TELEGRAM_BOT_TOKEN=your_bot_token
WEBAPP_URL=https://your-frontend-url.com
DATABASE_URL=postgresql://...
```

## 📱 Telegram Bot Commands

- `/start` - Welcome message and main menu
- `/jobs` - Browse available jobs
- `/wallet` - Check wallet balance
- `/profile` - View user profile
- `/help` - Show help message

## 🚀 Deployment

The platform is deployed on Render.com with:
- **Frontend**: Static site deployment
- **Backend**: Node.js web service
- **Database**: PostgreSQL
- **Cache**: Redis
- **Bot**: Docker container

### Deploy Commands
```bash
# Deploy all changes
git add .
git commit -m "Deploy updates"
git push origin main

# Or use deployment script
./deploy.bat  # Windows
./deploy.sh   # Linux/Mac
```

## 🧪 Testing

### API Testing
1. Open `test-suite.html` in browser
2. Test all endpoints automatically
3. Register test account
4. Verify all features

### Manual Testing
1. **Web**: Register → Complete profile → Browse jobs → Check wallet
2. **Telegram**: Start bot → Use commands → Open mini app
3. **Real-time**: Send messages → Check notifications

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- Redis session blacklisting
- Helmet.js security headers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- **Issues**: Create GitHub issue
- **Email**: support@temariware.com
- **Telegram**: Contact bot for support

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for Ethiopian students**