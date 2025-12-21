# TemariWare Deployment Guide

## 🚀 Quick Deploy to Render.com (FREE)

### Prerequisites
1. GitHub account
2. Render.com account (sign up at https://render.com)
3. Gemini API key (get from https://makersuite.google.com/app/apikey)
4. (Optional) Chapa API key for real payments

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - TemariWare v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/temariware.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com/dashboard
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click "Apply"

### Step 3: Configure Environment Variables
In Render Dashboard, set these secrets:
- `GEMINI_API_KEY`: Your Google AI API key
- `CHAPA_SECRET_KEY`: (Optional) Your Chapa payment key
- `JWT_SECRET`: (Auto-generated)

### Step 4: Access Your App
- Frontend: `https://temariware-frontend.onrender.com`
- Backend API: `https://temariware-backend.onrender.com`

---

## 🐳 Alternative: Railway.app

### Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Configure Services
1. Backend: `cd backend && npm start`
2. Frontend: `npm run build` (static)
3. Database: Add PostgreSQL plugin

---

## 📱 Telegram Mini App Setup

### Step 1: Create Bot
1. Message @BotFather on Telegram
2. Send `/newbot`
3. Name: **TemariWare**
4. Username: **temariware_bot**
5. Save the bot token

### Step 2: Create Mini App
1. Send `/newapp` to @BotFather
2. Select your bot
3. Title: **TemariWare**
4. Description: **Student success platform**
5. Web App URL: `https://temariware-frontend.onrender.com`
6. Upload icon (512x512 PNG)

### Step 3: Test
1. Open your bot in Telegram
2. Click "Open App" button
3. TemariWare will load as a mini app!

---

## 🔐 Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable 2FA for admin accounts

### Performance
- [ ] Enable database indexing
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression

### Monitoring
- [ ] Set up error logging (Sentry)
- [ ] Configure uptime monitoring
- [ ] Enable analytics
- [ ] Set up automated backups

### Payment
- [ ] Get real Chapa API keys
- [ ] Test payment flow end-to-end
- [ ] Set up webhook endpoints
- [ ] Configure refund policies

---

## 💰 Monetization Activation

### Enable Real Payments
1. Sign up at https://chapa.co
2. Complete KYC verification
3. Get API keys (Test & Live)
4. Update `CHAPA_SECRET_KEY` in Render
5. Test with small amounts first

### Subscription Pricing
- Free: 0 ETB (default)
- Pro: 99 ETB/month
- Enterprise: 4,999 ETB/year

---

## 📊 Post-Deployment

### Monitor First Week
- User registrations
- Payment success rate
- Error rates
- Server response times
- Daily active users

### Marketing Launch
1. Share on university groups
2. Post on Ethiopian tech forums
3. Create demo video
4. Offer early-bird discount (50% off Pro)

---

## 🆘 Troubleshooting

### "Invalid credentials" error
```bash
# Re-run seed script
cd backend
node reseed.js
```

### Payment not working
- Check Chapa API key is set
- Verify webhook URL is accessible
- Check server logs for errors

### Database connection failed
- Verify DATABASE_URL is set
- Check PostgreSQL is running
- Run migrations: `npm run migrate`

---

## 📞 Support

- Email: support@temariware.com
- Telegram: @temariware_bot
- GitHub Issues: https://github.com/YOUR_USERNAME/temariware/issues

**Deployment Time: ~10 minutes**
**Cost: $0/month (Free tier)**
