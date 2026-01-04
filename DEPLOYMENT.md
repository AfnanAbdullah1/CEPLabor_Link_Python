# Deploying LaborLink to Render - Step-by-Step Guide

This guide will walk you through deploying your LaborLink application to Render's free tier.

## 📋 Prerequisites

- GitHub account
- Git repository with your LaborLink code
- Render account (free) - Sign up at [render.com](https://render.com)

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Commit all changes to Git:**
   ```bash
   cd d:\IUB_Data\5th Sem\Python\Project\CEP_LaborLink\CEP_LaborLink\CEPLabor_Link_Python
   git add .
   git commit -m "Prepare for Render deployment"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```
   *(Replace `main` with your branch name if different)*

---

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up using your GitHub account (recommended)
4. Authorize Render to access your GitHub repositories

---

### Step 3: Create PostgreSQL Database

1. **From Render Dashboard:**
   - Click **"New +"** button
   - Select **"PostgreSQL"**

2. **Configure Database:**
   - **Name**: `laborlink-db`
   - **Database**: `laborlink`
   - **User**: `laborlink`
   - **Region**: Choose closest to you (e.g., Singapore, Oregon)
   - **Plan**: **Free**

3. **Create Database:**
   - Click **"Create Database"**
   - Wait for provisioning (1-2 minutes)

4. **Copy Internal Database URL:**
   - Go to database dashboard
   - Find **"Internal Database URL"** (starts with `postgresql://...`)
   - Copy this URL (you'll need it later)

---

### Step 4: Deploy Backend API

1. **From Render Dashboard:**
   - Click **"New +"** button
   - Select **"Web Service"**

2. **Connect Repository:**
   - Select your GitHub repository
   - Click **"Connect"**

3. **Configure Web Service:**
   - **Name**: `laborlink-backend`
   - **Region**: Same as your database
   - **Root Directory**: `backend`
   - **Runtime**: **Python 3**
   - **Build Command**: 
     ```bash
     chmod +x ./build.sh && ./build.sh
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan**: **Free**

4. **Add Environment Variables:**
   Click **"Advanced"** → **"Add Environment Variable"**
   
   Add these variables:
   
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Paste Internal Database URL from Step 3 |
   | `SECRET_KEY` | Generate random key: use [this generator](https://randomkeygen.com/) or run `openssl rand -hex 32` |
   | `ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
   | `CORS_ORIGINS` | Leave empty for now (we'll update after frontend deployment) |

5. **Create Web Service:**
   - Click **"Create Web Service"**
   - Wait for deployment (5-10 minutes)
   - Build logs will show installation and migration progress

6. **Note Backend URL:**
   - Once deployed, copy the service URL
   - Format: `https://laborlink-backend.onrender.com`

7. **Test Backend:**
   - Visit `https://laborlink-backend.onrender.com/docs`
   - You should see the FastAPI Swagger documentation

---

### Step 5: Deploy Frontend

1. **From Render Dashboard:**
   - Click **"New +"** button
   - Select **"Static Site"**

2. **Connect Repository:**
   - Select your GitHub repository
   - Click **"Connect"**

3. **Configure Static Site:**
   - **Name**: `laborlink-frontend`
   - **Region**: Same as backend
   - **Root Directory**: `frontend`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `build`

4. **Add Environment Variable:**
   Click **"Advanced"** → **"Add Environment Variable"**
   
   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | Your backend URL (e.g., `https://laborlink-backend.onrender.com`) |

5. **Create Static Site:**
   - Click **"Create Static Site"**
   - Wait for build and deployment (5-8 minutes)

6. **Note Frontend URL:**
   - Once deployed, copy the site URL
   - Format: `https://laborlink-frontend.onrender.com`

---

### Step 6: Update CORS Configuration

Your backend needs to allow requests from your frontend domain.

1. **Go to Backend Service:**
   - Open your `laborlink-backend` service in Render dashboard

2. **Update Environment Variables:**
   - Find `CORS_ORIGINS` variable
   - Update value to: `https://laborlink-frontend.onrender.com`
   - Click **"Save Changes"**

3. **Trigger Redeploy:**
   - Backend will automatically redeploy with new CORS settings
   - Wait 2-3 minutes

---

### Step 7: Test Your Deployment

1. **Visit Frontend:**
   - Open `https://laborlink-frontend.onrender.com`
   - You should see the LaborLink login page

2. **Create Test Accounts:**
   - Sign up as a Worker
   - Sign up as a Hirer (use different email)

3. **Test Core Features:**
   - ✅ Worker: Create profile with skills
   - ✅ Hirer: Browse workers
   - ✅ Hirer: Send hiring request
   - ✅ Worker: Accept request
   - ✅ Chat: Send messages
   - ✅ Hirer: Submit review

---

## 🎯 Quick Reference

### Your Deployed URLs

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | `https://laborlink-frontend.onrender.com` | Main application |
| Backend | `https://laborlink-backend.onrender.com` | API server |
| API Docs | `https://laborlink-backend.onrender.com/docs` | Swagger UI |
| Database | Internal PostgreSQL | Managed by Render |

---

## ⚠️ Important Notes

### Free Tier Limitations

1. **Cold Starts:**
   - Services spin down after 15 minutes of inactivity
   - First request after inactivity takes ~30 seconds
   - Subsequent requests are fast

2. **Database Expiry:**
   - Free PostgreSQL expires after 90 days
   - You'll need to create a new database and migrate data
   - Or upgrade to paid plan ($7/month)

3. **Monthly Limits:**
   - 750 hours/month for web services
   - Sufficient for hobby projects

### Auto-Deploy

- By default, services auto-deploy when you push to GitHub
- Disable in service settings if you want manual control

---

## 🐛 Troubleshooting

### Backend won't start

**Check build logs:**
- Go to backend service → **Logs** tab
- Look for Python errors or missing dependencies

**Common fixes:**
- Verify `DATABASE_URL` is correct
- Ensure `SECRET_KEY` is set
- Check build.sh has execute permissions

### Frontend can't connect to backend

**Check CORS settings:**
- Verify `CORS_ORIGINS` includes your frontend URL
- Check `REACT_APP_API_URL` is set correctly

**Test backend directly:**
- Visit backend `/docs` endpoint
- Try API calls from Swagger UI

### Database connection errors

**Verify DATABASE_URL:**
- Should use **Internal Database URL**, not External
- Format: `postgresql://user:pass@host/database`

**Check database status:**
- Go to database service dashboard
- Ensure status is "Available"

### Cold start is slow

**This is normal for free tier:**
- First request after 15 min idle: ~30 seconds
- Keep service warm by pinging it periodically
- Or upgrade to paid plan (no spin-down)

---

## 📱 Access from Mobile

Your app is now accessible from anywhere!

1. **On your phone:**
   - Open browser
   - Navigate to: `https://laborlink-frontend.onrender.com`

2. **Share with others:**
   - Send them the frontend URL
   - No installation required
   - Works on all devices

---

## 🔄 Making Updates

### Update Code

1. **Make changes locally**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. **Auto-deploy:**
   - Render automatically detects push
   - Rebuilds and redeploys
   - Takes 5-10 minutes

### Manual Redeploy

1. Go to service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Upgrade Options (Optional)

If you need more reliability:

### Paid Plans
- **Web Services**: $7/month (no spin-down, more resources)
- **PostgreSQL**: $7/month (persistent beyond 90 days)

### Benefits
- No cold starts
- Permanent database
- More CPU/RAM
- Custom domains
- Priority support

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API docs accessible
- [ ] User registration works
- [ ] Login works
- [ ] Database persists data
- [ ] CORS configured properly
- [ ] Mobile responsive
- [ ] All features tested

---

## 🎉 Congratulations!

Your LaborLink application is now live on the internet!

**Share your deployed app:**
- Frontend: `https://laborlink-frontend.onrender.com`
- Add to portfolio/resume
- Share with friends and potential users

---

## 📞 Need Help?

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **Check Logs**: Always check service logs for errors
