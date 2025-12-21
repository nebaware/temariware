require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

// Replace with your Telegram Bot Token from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

// Express app for serving the mini app
const app = express();
const PORT = process.env.PORT || 3001;

// Serve mini app static files
app.use(express.static(path.join(__dirname, 'webapp')));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Mini app server running on port ${PORT}`);
    console.log(`📱 Telegram bot is active`);
});

// Debug: Log all incoming messages
bot.on('message', (msg) => {
    console.log('📨 Received message:', msg.text, 'from', msg.from.username || msg.from.first_name);
});

//Bot Commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    const welcomeMessage = `
🎓 Welcome to TemariWare, ${username}!

Your all-in-one student platform for:
• 💼 Finding Jobs & Internships
• 🎯 Skill Development
• 💰 Wallet & Payments
• 👥 Networking
• 📚 Learning Resources

Choose an option below:
    `;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '💼 Browse Jobs', callback_data: 'jobs' },
                    { text: '💰 My Wallet', callback_data: 'wallet' }
                ],
                [
                    { text: '👤 My Profile', callback_data: 'profile' },
                    { text: '📚 Courses', callback_data: 'courses' }
                ]
            ]
        }
    };

    console.log('✅ Sending welcome message to', username);
    bot.sendMessage(chatId, welcomeMessage, options);
});

bot.onText(/\/jobs/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '💼 *Available Jobs*\n\n📌 Backend Developer - Remote - 15,000 ETB\n📌 UI Designer - Addis Ababa - 12,000 ETB\n📌 Data Entry - Part-time - 5,000 ETB\n\n🌐 View all: http://localhost:3000/#/work', {
        parse_mode: 'Markdown'
    });
});

bot.onText(/\/wallet/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '💰 *Your Wallet*\n\n💵 Balance: 1,250 ETB\n📊 Earned: 5,600 ETB\n📤 Pending: 300 ETB\n\n🌐 Manage: http://localhost:3000/#/wallet', {
        parse_mode: 'Markdown'
    });
});

bot.onText(/\/profile/, (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    bot.sendMessage(chatId, `👤 *Your Profile*\n\nName: ${user.first_name}\n✅ Verified Student\n⭐ Level 5\n🎯 85% Profile Strength\n\n🌐 View: http://localhost:3000/#/profile`, {
        parse_mode: 'Markdown'
    });
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
ℹ️ *TemariWare Bot Commands*

/start - Start the bot
/jobs - Browse available jobs
/wallet - Check your wallet
/profile - View your profile
/help - Show this help message

🌐 *Web Platform*
http://localhost:3000
    `, {
        parse_mode: 'Markdown'
    });
});

// Handle callback queries
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    switch (data) {
        case 'jobs':
            bot.answerCallbackQuery(query.id);
            bot.sendMessage(chatId, '💼 *Latest Jobs*\n\n📌 Backend Developer - 15,000 ETB\n📌 UI Designer - 12,000 ETB\n📌 Data Entry - 5,000 ETB\n\n🌐 http://localhost:3000/#/work', { parse_mode: 'Markdown' });
            break;
        case 'wallet':
            bot.answerCallbackQuery(query.id);
            bot.sendMessage(chatId, '💰 *Wallet Summary*\n\n💵 Balance: 1,250 ETB\n📊 Earned: 5,600 ETB\n📤 Pending: 300 ETB\n\n🌐 http://localhost:3000/#/wallet', { parse_mode: 'Markdown' });
            break;
        case 'profile':
            bot.answerCallbackQuery(query.id);
            bot.sendMessage(chatId, '👤 *Your Profile*\n\n✅ Verified Student\n⭐ Level 5\n🎯 85% Complete\n\n🌐 http://localhost:3000/#/profile', { parse_mode: 'Markdown' });
            break;
        case 'courses':
            bot.answerCallbackQuery(query.id);
            bot.sendMessage(chatId, '📚 *Available Courses*\n\n📖 Web Development\n📖 Data Science\n📖 Mobile Apps\n\n🌐 http://localhost:3000/#/gebeta', { parse_mode: 'Markdown' });
            break;
        default:
            bot.answerCallbackQuery(query.id);
    }
});

// Handle errors
bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.message);
});

console.log('✅ TemariWare Telegram Bot started successfully!');
