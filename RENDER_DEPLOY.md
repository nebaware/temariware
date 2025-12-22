# TemariWare - Simplified Render Deployment

## One-Click Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/nebaware/temariware)

---

## Manual Deployment Steps

Since the one-click deploy may have issues with the free tier database limit, here's the manual process:

### Prerequisites
- Render.com account (free)
- Your GitHub repository: `nebaware/temariware`

---

### Step 1: Delete Old Database (if exists)

1. Go to: https://dashboard.render.com
2. Click "PostgreSQL" in sidebar
3. Find any old `temariware-db` databases
4. Click on it → "Delete Database"
5. Confirm deletion

---

### Step 2: Create Database

1. Click "New +" → "PostgreSQL"
2. Fill in:
   ```
   Name: temariware-db
   Database: temariware
   User: temariware
   Region: Oregon (or closest)
   Plan: Free
   ```
3. Click "Create Database"
4. Wait 2-3 minutes for "Available" status
5. **Copy "Internal Database URL"** (looks like `postgresql://...`)

---

### Step 3: Create Backend Service

1. Click "New +" → "Web Service"
2. Click "Connect a repository" → Select `nebaware/temariware`
3. Fill in:
   ```
   Name: temariware-backend
   Root Directory: backend
   Environment: Node
   Region: Oregon
   Branch: main
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. Click "Advanced" → Add Environment Variables:
   ```
   NODE_ENV = production
   PORT = 5000
   JWT_SECRET = (click "Generate" button)
   DATABASE_URL = (paste from Step 2)
   GEMINI_API_KEY = AIzaSyDH3U1BR3illkQX0U4aYH8Pjlm68IQGfbg
   CORS_ORIGIN = https://temariware-frontend.onrender.com
   API_BASE_URL = https://temariware-backend.onrender.com
   FRONTEND_URL = https://temariware-frontend.onrender.com
   ```

5. Click "Create Web Service"
6. Wait 5-7 minutes for deployment

---

### Step 4: Create Frontend Service

1. Click "New +" → "Static Site"
2. Select `nebaware/temariware`
3. Fill in:
   ```
   Name: temariware-frontend
   Root Directory: (leave empty)
   Branch: main
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. Add Environment Variable:
   ```
   VITE_API_BASE = https://temariware-backend.onrender.com
   ```

5. Click "Create Static Site"
6. Wait 3-5 minutes for deployment

---

### Step 5: Verify Deployment

**Backend:**
- URL: `https://temariware-backend.onrender.com`
- Health check: `https://temariware-backend.onrender.com/health`
- Should return: `{"status":"ok"}`

**Frontend:**
- URL: `https://temariware-frontend.onrender.com`
- Should load the login page
- Login: `admin@temariware.com` / `Password123`

---

## Troubleshooting

### "Another action failed" Error
- **Cause**: You already have a free database
- **Fix**: Delete the old database first (Step 1)

### Backend Build Fails
- **Check**: All environment variables are set
- **Check**: DATABASE_URL is correct
- **Check**: Logs tab for specific error

### Frontend 404 Error
- **Check**: Build command completed successfully
- **Check**: `dist` folder was created
- **Check**: VITE_API_BASE points to backend URL

---

## Alternative: Railway.app

If Render continues to have issues, try Railway:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to GitHub
railway link

# Deploy
railway up
```

Then add the same environment variables in Railway dashboard.

---

## Success Checklist

- [ ] Database created and "Available"
- [ ] Backend deployed and "Live"
- [ ] Frontend deployed and "Live"
- [ ] Can access frontend URL
- [ ] Can login successfully
- [ ] Subscription page works
- [ ] AI Resume Builder works

---

## Support

If you encounter issues:
1. Check Render Dashboard → Logs tab
2. Look for red error messages
3. Common fixes:
   - Restart service
   - Verify environment variables
   - Check database connection

**Deployment Time: 15-20 minutes**
**Cost: $0/month**
