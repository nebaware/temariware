# Quick Setup Guide

## Step 1: Get Bot Token (5 minutes)

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name: `TemariWare Bot`
4. Choose a username: `temariware_bot` (must end with _bot)
5. **Copy the bot token** (looks like: `123456789:ABCdefGhiJklMNOpqrsTUVwxyz`)

## Step 2: Configure Bot

1. Copy `.env.example` to `.env`:
   ```bash
   cd telegram-bot
   cp .env.example .env
   ```

2. Edit `.env` and replace `YOUR_BOT_TOKEN_FROM_BOTFATHER` with your actual token

## Step 3: Install & Run

```bash
npm install
npm start
```

You should see:
```
✅ TemariWare Telegram Bot started successfully!
🚀 Mini app server running on port 3001
📱 Telegram bot is active
```

## Step 4: Test Bot

1. Open Telegram
2. Search for your bot username
3. Send `/start`
4. You should see the welcome message with buttons!

## Features

- `/start` - Main menu
- `/jobs` - Browse jobs  
- `/wallet` - Check wallet
- `/profile` - View profile
- `/help` - Show help

## Troubleshooting

**Error: "Conflict: terminated by other getUpdates request"**
- Another instance is running, stop it first

**Bot doesn't respond:**
- Check token is correct in `.env`
- Make sure port 3001 is not in use

**Mini app won't open:**
- Update `PLATFORM_URL` in `.env` to your actual platform URL
