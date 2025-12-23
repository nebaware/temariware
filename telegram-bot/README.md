# TemariWare Telegram Bot

🚀 **Live Bot**: Search your bot on Telegram  
🌐 **Web Platform**: [https://temariware-frontend-exz5.onrender.com](https://temariware-frontend-exz5.onrender.com)  
🔧 **Backend API**: [https://temariware-backend-cqpb-exz5.onrender.com](https://temariware-backend-cqpb-exz5.onrender.com)

Telegram bot and mini app integration for TemariWare platform.

## 🚀 Quick Start

1. **Find Bot**: Search your bot username on Telegram
2. **Start**: Send `/start` command
3. **Mini App**: Click "🚀 Open TemariWare" button
4. **Commands**: Use `/jobs`, `/wallet`, `/profile`, `/help`

## 📱 Bot Commands

- `/start` - Welcome message and main menu with mini app button
- `/jobs` - Browse available jobs (shows top 3 + web link)
- `/wallet` - Check wallet balance and recent transactions
- `/profile` - View user profile summary
- `/help` - Show all available commands

## 🌟 Mini App Features

- **Full Platform Access**: Complete TemariWare functionality in Telegram
- **Native Integration**: Telegram theme and UI elements
- **Real-time Sync**: Live updates with main platform
- **Deep Linking**: Direct access to specific features
- **Offline Support**: Cached data for better performance

## 🛠️ Development Setup

### Prerequisites
- Telegram Bot Token from @BotFather
- Node.js 18+
- Access to TemariWare backend API

### Setup Steps
```bash
# Clone and install
cd telegram-bot
npm install

# Configure environment
cp .env.example .env
# Add your TELEGRAM_BOT_TOKEN

# Run development
npm run dev

# Run production
npm start
```

### Environment Variables
```env
TELEGRAM_BOT_TOKEN=8532692467:AAFJU_iZuvMhpcXvNr5hKxBhuBzv_w2_euM
WEBAPP_URL=https://temariware-frontend-exz5.onrender.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NODE_ENV=production
PORT=3001
```

## 🔧 Bot Configuration

### With @BotFather
1. **Create Bot**: `/newbot` → Follow instructions
2. **Set Commands**: `/setcommands` → Paste command list
3. **Set Description**: `/setdescription` → Add bot description
4. **Set About**: `/setabouttext` → Add about text
5. **Set Menu Button**: Configure web app button

### Command List for @BotFather
```
start - Start the bot and see main menu
jobs - Browse available jobs
wallet - Check your wallet balance
profile - View your profile
help - Show help message
```

## 🚀 Deployment

Deployed automatically via Render.com:
- **Service**: Docker container
- **Auto-deploy**: On git push to main
- **Environment**: Production variables set
- **Health Check**: Bot polling status

## 🔒 Security

- Environment variables for sensitive data
- Input validation and sanitization
- Rate limiting on bot commands
- User authentication via web platform
- Secure webhook handling

## 📊 Bot Analytics

- User interaction tracking
- Command usage statistics
- Error monitoring and logging
- Performance metrics

## 🤝 Integration

### With Main Platform
- **Authentication**: Seamless login via web
- **Data Sync**: Real-time updates
- **Notifications**: Push alerts via bot
- **Deep Links**: Direct feature access

### With Database
- **User Data**: Synced with main database
- **Transactions**: Real-time wallet updates
- **Jobs**: Live job postings
- **Messages**: Integrated messaging system

## 🧪 Testing

```bash
# Test bot locally
npm run test

# Test specific commands
node test-commands.js

# Monitor logs
npm run logs
```

## 📞 Support

- **Bot Issues**: Contact via `/help` command
- **Technical**: Create GitHub issue
- **General**: support@temariware.com

---

**Part of the TemariWare ecosystem - Empowering Ethiopian students** 🇪🇹
