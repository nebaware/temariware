require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

// API Configuration
const API_BASE = process.env.API_URL || 'https://temariware-backend-omek.onrender.com';
const token = process.env.TELEGRAM_BOT_TOKEN || '8532692467:AAFJU_iZuvMhpcXvNr5hKxBhuBzv_w2_euM';
const webAppUrl = process.env.WEBAPP_URL || 'https://temariware-frontend-omek.onrender.com';

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error.message);
        return { success: false, error: 'API connection failed' };
    }
}

async function getJobs() {
    const result = await apiCall('/api/jobs');
    return result.success !== false ? result.slice(0, 3) : [];
}

async function getWalletInfo(userId) {
    // For now, return mock data since we need user authentication
    return {
        balance: 1250,
        earned: 5600,
        pending: 300
    };
}

async function getCourses() {
    const result = await apiCall('/api/courses');
    return result.success !== false ? result.slice(0, 3) : [];
}

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
                    { text: '🚀 Open TemariWare', web_app: { url: webAppUrl } }
                ],
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

bot.onText(/\/jobs/, async (msg) => {
    const chatId = msg.chat.id;
    const jobs = await getJobs();
    
    if (jobs.length > 0) {
        let jobsText = '💼 *Available Jobs*\n\n';
        jobs.forEach(job => {
            jobsText += `📌 ${job.title} - ${job.location || 'Remote'} - ${job.salary || 'Negotiable'}\n`;
        });
        jobsText += `\n🌐 View all: ${webAppUrl}/#/work`;
        
        bot.sendMessage(chatId, jobsText, { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, `💼 *Jobs Loading...*\n\n🔄 Fetching latest opportunities\n\n🌐 View all: ${webAppUrl}/#/work`, {
            parse_mode: 'Markdown'
        });
    }
});

bot.onText(/\/wallet/, async (msg) => {
    const chatId = msg.chat.id;
    const walletInfo = await getWalletInfo(msg.from.id);
    
    bot.sendMessage(chatId, `💰 *Your Wallet*\n\n💵 Balance: ${walletInfo.balance} ETB\n📊 Earned: ${walletInfo.earned} ETB\n📤 Pending: ${walletInfo.pending} ETB\n\n🌐 Manage: ${webAppUrl}/#/wallet`, {
        parse_mode: 'Markdown'
    });
});

bot.onText(/\/profile/, (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    bot.sendMessage(chatId, `👤 *Your Profile*\n\nName: ${user.first_name}\n✅ Verified Student\n⭐ Level 5\n🎯 85% Profile Strength\n\n🌐 View: ${webAppUrl}/#/profile`, {
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
${webAppUrl}
    `, {
        parse_mode: 'Markdown'
    });
});

// Handle callback queries
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    switch (data) {
        case 'jobs':
            bot.answerCallbackQuery(query.id);
            const jobs = await getJobs();
            if (jobs.length > 0) {
                let jobsText = '💼 *Latest Jobs*\n\n';
                jobs.forEach(job => {
                    jobsText += `📌 ${job.title} - ${job.salary || 'Negotiable'}\n`;
                });
                jobsText += `\n🌐 ${webAppUrl}/#/work`;
                bot.sendMessage(chatId, jobsText, { parse_mode: 'Markdown' });
            } else {
                bot.sendMessage(chatId, `💼 *Jobs Loading...*\n\n🔄 Fetching opportunities\n\n🌐 ${webAppUrl}/#/work`, { parse_mode: 'Markdown' });
            }
            break;
        case 'wallet':
            bot.answerCallbackQuery(query.id);
            const walletInfo = await getWalletInfo(query.from.id);
            bot.sendMessage(chatId, `💰 *Wallet Summary*\n\n💵 Balance: ${walletInfo.balance} ETB\n📊 Earned: ${walletInfo.earned} ETB\n📤 Pending: ${walletInfo.pending} ETB\n\n🌐 ${webAppUrl}/#/wallet`, { parse_mode: 'Markdown' });
            break;
        case 'profile':
            bot.answerCallbackQuery(query.id);
            bot.sendMessage(chatId, `👤 *Your Profile*\n\n✅ Telegram User\n⭐ Active Member\n🎯 Connect via Web App\n\n🌐 ${webAppUrl}/#/profile`, { parse_mode: 'Markdown' });
            break;
        case 'courses':
            bot.answerCallbackQuery(query.id);
            const courses = await getCourses();
            if (courses.length > 0) {
                let coursesText = '📚 *Available Courses*\n\n';
                courses.forEach(course => {
                    coursesText += `📖 ${course.title || course.name}\n`;
                });
                coursesText += `\n🌐 ${webAppUrl}/#/gebeta`;
                bot.sendMessage(chatId, coursesText, { parse_mode: 'Markdown' });
            } else {
                bot.sendMessage(chatId, `📚 *Courses Loading...*\n\n🔄 Fetching courses\n\n🌐 ${webAppUrl}/#/gebeta`, { parse_mode: 'Markdown' });
            }
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
