@echo off
echo 🚀 Deploying TemariWare to Render...

git add .
git commit -m "Deploy: Configure Telegram bot and production settings"
git push origin main

echo ✅ Deployment initiated!
echo.
echo 📱 Your Telegram Bot Token: 8532692467:AAFJU_iZuvMhpcXvNr5hKxBhuBzv_w2_euM
echo 🌐 Web Platform: https://temariware-frontend.onrender.com
echo 🔧 Backend API: https://temariware-backend-cqpb-exz5.onrender.com
echo.
echo ⏳ Wait 5-10 minutes for deployment to complete
echo 🔍 Check deployment status at: https://dashboard.render.com
pause