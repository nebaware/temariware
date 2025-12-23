#!/bin/bash

echo "🚀 Deploying TemariWare to Render..."

# Add all changes
git add .

# Commit changes
git commit -m "Deploy: Configure Telegram bot and production settings"

# Push to main branch
git push origin main

echo "✅ Deployment initiated!"
echo ""
echo "📱 Your Telegram Bot: @YourBotName"
echo "🌐 Web Platform: https://temariware-frontend.onrender.com"
echo "🔧 Backend API: https://temariware-backend-cqpb-exz5.onrender.com"
echo ""
echo "⏳ Wait 5-10 minutes for deployment to complete"
echo "🔍 Check deployment status at: https://dashboard.render.com"