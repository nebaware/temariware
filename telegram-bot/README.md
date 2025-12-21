# TemariWare Telegram Bot

Telegram bot and mini app integration for TemariWare platform.

## Setup

1. **Create Telegram Bot**:
   - Open Telegram and search for @BotFather
   - Send `/newbot` and follow instructions
   - Save the bot token

2. **Configure Environment**:
   ```bash
   # Create .env file
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   PORT=3001
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Bot**:
   ```bash
   npm start
   ```

## Bot Commands

- `/start` - Start the bot and see main menu
- `/jobs` - Browse available jobs
- `/wallet` - Check wallet balance
- `/profile` - View profile
- `/help` - Show help message

## Mini App

The mini app is a lightweight web interface accessible through Telegram.

**Features**:
- Quick access to jobs, wallet, courses
- Telegram theme integration
- Deep linking to main platform
- Native Telegram UI elements

## Development

```bash
npm run dev  # Run with nodemon for auto-restart
```

## Deployment

1. Deploy bot to a server (Heroku, DigitalOcean, etc.)
2. Update webhook URL in bot settings
3. Deploy mini app static files to CDN
4. Update URLs in bot.js

## Security

- Never commit .env file
- Use environment variables for sensitive data
- Implement user authentication
- Validate all inputs
