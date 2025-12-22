#!/bin/bash

# TemariWare Deployment Helper Script
# This script helps you deploy to Render.com manually

echo "🚀 TemariWare Deployment Helper"
echo "================================"
echo ""

echo "📋 Pre-Deployment Checklist:"
echo "1. Do you have a Render.com account? (https://dashboard.render.com)"
echo "2. Have you deleted any old temariware databases?"
echo "3. Do you have your GEMINI_API_KEY ready?"
echo ""

read -p "Press Enter to continue..."

echo ""
echo "📝 Step-by-Step Instructions:"
echo ""

echo "STEP 1: Create Database"
echo "----------------------"
echo "1. Go to: https://dashboard.render.com"
echo "2. Click 'New +' → 'PostgreSQL'"
echo "3. Name: temariware-db"
echo "4. Database: temariware"
echo "5. Plan: Free"
echo "6. Click 'Create Database'"
echo "7. Wait for 'Available' status"
echo "8. Copy the 'Internal Database URL'"
echo ""
read -p "Have you created the database and copied the URL? (y/n): " db_created

if [ "$db_created" != "y" ]; then
    echo "Please create the database first, then run this script again."
    exit 1
fi

echo ""
read -p "Paste your DATABASE_URL here: " DATABASE_URL

echo ""
echo "STEP 2: Create Backend Service"
echo "------------------------------"
echo "1. Click 'New +' → 'Web Service'"
echo "2. Select 'nebaware/temariware' repository"
echo "3. Name: temariware-backend"
echo "4. Root Directory: backend"
echo "5. Build Command: npm install"
echo "6. Start Command: npm start"
echo ""
echo "Environment Variables to add:"
echo "NODE_ENV=production"
echo "PORT=5000"
echo "JWT_SECRET=(click Generate)"
echo "DATABASE_URL=$DATABASE_URL"
echo "GEMINI_API_KEY=AIzaSyDH3U1BR3illkQX0U4aYH8Pjlm68IQGfbg"
echo "CORS_ORIGIN=https://temariware-frontend.onrender.com"
echo "API_BASE_URL=https://temariware-backend.onrender.com"
echo "FRONTEND_URL=https://temariware-frontend.onrender.com"
echo ""
read -p "Have you created the backend service? (y/n): " backend_created

if [ "$backend_created" != "y" ]; then
    echo "Please create the backend service, then run this script again."
    exit 1
fi

echo ""
echo "STEP 3: Create Frontend Service"
echo "-------------------------------"
echo "1. Click 'New +' → 'Static Site'"
echo "2. Select 'nebaware/temariware' repository"
echo "3. Name: temariware-frontend"
echo "4. Build Command: npm install && npm run build"
echo "5. Publish Directory: dist"
echo ""
echo "Environment Variable to add:"
echo "VITE_API_BASE=https://temariware-backend.onrender.com"
echo ""
read -p "Have you created the frontend service? (y/n): " frontend_created

if [ "$frontend_created" != "y" ]; then
    echo "Please create the frontend service, then run this script again."
    exit 1
fi

echo ""
echo "✅ Deployment Configuration Complete!"
echo ""
echo "⏱️  Now wait for deployment (10-15 minutes):"
echo "   - Backend: ~5-7 minutes"
echo "   - Frontend: ~3-5 minutes"
echo ""
echo "🔍 Monitor deployment:"
echo "   - Check 'Logs' tab for each service"
echo "   - Backend should show: 'Server running on port 5000'"
echo "   - Frontend should show: 'Build completed'"
echo ""
echo "🎯 Once deployed, test your app:"
echo "   - Frontend: https://temariware-frontend.onrender.com"
echo "   - Backend Health: https://temariware-backend.onrender.com/health"
echo "   - Login: admin@temariware.com / Password123"
echo ""
echo "🎉 Good luck with your deployment!"
