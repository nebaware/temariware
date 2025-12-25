# TemariWare - Student Ecosystem Platform

🚀 **Live Platform**: [https://temariware.onrender.com](https://temariware.onrender.com)  
📱 **Telegram Bot**: Search `@temariwarebot` on Telegram

## 🌟 Features

- Student verification and portfolio system
- AI-powered job matching and career guidance
- Ethiopian payment integration (Telebirr, CBE, Dashen)
- Real-time messaging and collaboration
- Learning platform with certification
- Ekub savings groups with smart rotation
- Multi-language support (English/Amharic)
- Progressive web app with Telegram integration

## 🚀 Quick Start

### Web Platform
1. Visit: [https://temariware.onrender.com](https://temariware.onrender.com)
2. **Complete User Flow**:
   - Register/Login with secure authentication
   - Complete your profile setup with AI scoring
   - Browse AI-matched jobs and internships
   - Manage wallet with Ethiopian payment systems
   - Enroll in courses with progress tracking
   - Network with verified students
   - Access admin panel (admin users only)
3. **Demo Access**:
   - Create your own account or contact support for demo access
   - Admin access requires proper authorization
4. **API Endpoints**: https://temariware-backend-omek.onrender.com

### Telegram Bot
1. Search for `@temariwarebot` on Telegram
2. Send `/start` to begin with personalized stats
3. Use web app buttons for direct navigation:
   - 💼 Jobs: Direct to job marketplace
   - 📚 Courses: Access Gebeta learning platform
   - 💰 Wallet: Manage Ethiopian payments
   - 👤 Profile: View verification status
4. Commands: `/menu`, `/jobs`, `/wallet`, `/profile`, `/help`

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Database system
- Cache system
- Required API credentials (contact team for details)

### Backend Setup
```bash
cd backend
npm install
# Configure environment variables
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
npm install
# Start development server
npm run dev
```

### Telegram Bot Setup
```bash
cd telegram-bot
npm install
# Configure bot token
npm start
```

## 📱 Telegram Bot Commands

- `/start` - Welcome with live stats and web app access
- `/menu` - Quick navigation with URLs and buttons
- `/jobs` - Browse available opportunities
- `/wallet` - Check balance and transactions
- `/profile` - View verification status and stats
- `/courses` - Access learning platform
- `/help` - Complete command reference

## 🚀 Deployment

The platform is deployed on Render with microservices architecture:

**Active Services:**
- `temariware` - React frontend with PWA features
- `temariware-backend-omek` - Node.js API server
- `temariware-bot-omek` - Telegram bot service
- `temariware-redis` - Cache and session storage
- `temariware-db` - PostgreSQL with audit logging

**URLs:**
- **Frontend**: https://temariware.onrender.com
- **Backend API**: https://temariware-backend-omek.onrender.com
- **Admin Panel**: https://temariware.onrender.com?admin=true
- **Telegram Bot**: @temariwarebot

## 🧪 Testing

### Manual Testing Scenarios
1. **Student Journey**: Register → Verify University ID → Complete Portfolio → Apply to Jobs → Receive Payments
2. **Telegram Integration**: Start bot → Navigate pages → Check real-time data sync
3. **Admin Functions**: Access admin panel → Manage users → Monitor transactions → Review audit logs
4. **AI Features**: Test job matching → Skill gap analysis → Content moderation
5. **Ethiopian Features**: Test Amharic interface → Ethiopian calendar → Local payments

## 🔒 Security

- Multi-factor authentication and verification
- Real-time content moderation
- Secure payment processing
- Role-based access control
- Complete audit logging

## 🇪🇹 Ethiopian Focus

- Local payment system integration
- University partnerships
- Amharic language support
- Regional job categories
- Cultural adaptation

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes following coding standards
4. Test thoroughly (manual + automated)
5. Update documentation if needed
6. Submit pull request with detailed description

### Code Standards
- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express, PostgreSQL
- **Bot**: Node.js with Telegram Bot API
- **AI**: Modular services with fallback systems
- **Security**: Input validation, authentication, authorization

## 📞 Support

- **Issues**: Create GitHub issue with detailed description
- **Telegram**: Contact @temariwarebot for platform support
- **Email**: support@temariware.com (coming soon)
- **Documentation**: Check README and code comments
- **Community**: Join our Telegram group for developers

## 📄 License

MIT License - see LICENSE file for details

## 🚀 Future Roadmap

### Phase 1 (Current) - Core Platform
- ✅ Student verification system
- ✅ AI-powered job matching
- ✅ Ethiopian payment integration
- ✅ Telegram mini app
- ✅ Real-time features

### Phase 2 (Q2 2024) - Advanced Features
- ✅ Video conferencing integration
- ✅ Advanced portfolio builder
- ✅ Mentorship matching system
- 🔄 Corporate partnerships
- 🔄 Mobile app (iOS/Android)

### Phase 3 (Q3 2024) - Expansion
- 🔄 Multi-country support
- 🔄 Incubator program integration
- 🔄 Startup funding marketplace
- 🔄 Alumni network features
- 🔄 Enterprise solutions

### Phase 4 (Q4 2024) - Scale
- 🔄 AI-powered career counseling
- 🔄 Blockchain certificates
- 🔄 International job marketplace
- 🔄 University partnership program
- 🔄 Government integration

---

**Built with ❤️ for Ethiopian students by the TemariWare Team**

*Empowering the next generation of Ethiopian tech talent through AI-powered education, employment, and entrepreneurship opportunities.*