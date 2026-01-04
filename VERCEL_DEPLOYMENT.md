# Deploy LaborLink to Vercel + Supabase (100% FREE Forever)

A complete step-by-step guide to deploy your LaborLink application to **Vercel** (frontend + backend) and **Supabase** (database) - both completely free with no expiration!

---

## 🎯 What You'll Get

| Service | What It Hosts | Free Tier |
|---------|---------------|-----------|
| **Vercel** | React Frontend + FastAPI Backend | ✅ 100GB bandwidth/month, unlimited deployments |
| **Supabase** | PostgreSQL Database | ✅ 500MB database, 2GB bandwidth, no expiration |

**Total Cost:** $0 forever! 🎉

---

## 📋 Prerequisites

- ✅ GitHub account (you have this)
- ✅ GitHub Desktop (you have this)
- ✅ Code pushed to GitHub
- ⏱️ 30-40 minutes of your time

---

## 🚀 Step-by-Step Deployment

---

## PART 1: Setup Supabase Database (10 minutes)

### Step 1.1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with your **GitHub account** (easiest)
4. Verify your email if prompted

### Step 1.2: Create New Project

1. Click **"New Project"**
2. Fill in project details:
   - **Name**: `laborlink` or `LaborLink`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., Singapore, Mumbai, or US East)
   - **Pricing Plan**: **FREE** (should be selected by default)

3. Click **"Create new project"**
4. Wait ~2 minutes for provisioning

### Step 1.3: Get Database Connection String

1. Once project is ready, click **"Project Settings"** (gear icon bottom left)
2. Go to **"Database"** tab
3. Scroll down to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string (looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Replace `[YOUR-PASSWORD]`** with the password you created in step 1.2
7. **Save this URL** - you'll need it later!

### Step 1.4: Run Database Migrations

We need to create the tables in your Supabase database.

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste this SQL (I'll provide this after you confirm):

```sql
-- This will create all necessary tables
-- (I'll provide the exact SQL based on your models)
```

4. Click **"Run"**
5. You should see "Success" message

**✅ Database is ready!**

---

## PART 2: Deploy Backend to Vercel (15 minutes)

### Step 2.1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

### Step 2.2: Deploy Backend

1. On Vercel Dashboard, click **"Add New..."** → **"Project"**
2. **Import Git Repository:**
   - Find your `CEPLabor_Link_Python` repository
   - Click **"Import"**

3. **Configure Project:**
   - **Project Name**: `laborlink-backend` (or any name you like)
   - **Framework Preset**: Select **"Other"**
   - **Root Directory**: Click **"Edit"** → Select **`backend`** folder
   - **Build Command**: Leave empty or use: `pip install -r requirements.txt`
   - **Output Directory**: Leave empty
   - **Install Command**: Leave as default

4. **Environment Variables** - Click **"Add"** for each:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Paste your Supabase connection string from Step 1.3 |
   | `SECRET_KEY` | Generate: Open PowerShell and run: `python -c "import secrets; print(secrets.token_hex(32))"` |
   | `ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
   | `CORS_ORIGINS` | Leave empty for now (we'll update after frontend deployment) |

5. Click **"Deploy"**
6. Wait 2-5 minutes for deployment
7. Once deployed, **copy your backend URL** (e.g., `https://laborlink-backend-xxxx.vercel.app`)

**✅ Backend API is live!**

---

## PART 3: Deploy Frontend to Vercel (10 minutes)

### Step 3.1: Deploy Frontend

1. On Vercel Dashboard, click **"Add New..."** → **"Project"**
2. **Import the SAME repository** again (yes, same repo)
3. **Configure Project:**
   - **Project Name**: `laborlink-frontend` (or `laborlink`)
   - **Framework Preset**: Vercel should auto-detect **"Create React App"** ✅
   - **Root Directory**: Click **"Edit"** → Select **`frontend`** folder
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `build` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

4. **Environment Variables** - Add this one:

   | Name | Value |
   |------|-------|
   | `REACT_APP_API_URL` | Paste your backend URL from Step 2.2 (without trailing slash) |

5. Click **"Deploy"**
6. Wait 3-5 minutes for build and deployment
7. **Copy your frontend URL** (e.g., `https://laborlink-xxxx.vercel.app`)

**✅ Frontend is live!**

---

## PART 4: Update CORS Settings (5 minutes)

Your backend needs to allow requests from your frontend.

### Step 4.1: Update Backend Environment

1. Go to Vercel Dashboard
2. Click on your **backend project** (`laborlink-backend`)
3. Go to **"Settings"** → **"Environment Variables"**
4. Find `CORS_ORIGINS` variable
5. Edit it and set value to your **frontend URL**:
   ```
   https://laborlink-xxxx.vercel.app
   ```
6. Click **"Save"**

### Step 4.2: Redeploy Backend

1. Go to **"Deployments"** tab
2. Click the **three dots** (...) on the latest deployment
3. Click **"Redeploy"**
4. Wait ~2 minutes

**✅ CORS configured!**

---

## PART 5: Test Your Deployed App! (5 minutes)

### Step 5.1: Open Your App

1. Open your frontend URL: `https://laborlink-xxxx.vercel.app`
2. You should see the LaborLink login page

### Step 5.2: Test Core Features

1. **Create Worker Account:**
   - Click "Sign Up"
   - Fill in details
   - Select "Worker" role
   - Submit

2. **Create Hirer Account:**
   - Open app in **incognito/private window**
   - Sign up with different email
   - Select "Hirer" role

3. **Test Features:**
   - ✅ Worker: Create profile
   - ✅ Hirer: Browse workers
   - ✅ Hirer: Send hiring request
   - ✅ Worker: Accept request
   - ✅ Chat: Send messages
   - ✅ Hirer: Submit review

**🎉 Everything should work!**

---

## 📱 Access from Anywhere

Your app is now live on the internet!

- **Share with friends**: Send them your frontend URL
- **Mobile access**: Open URL on your phone's browser
- **Add to portfolio**: Include in your resume/portfolio
- **Demo for professors**: Share the live link

---

## 🔄 Making Updates (Auto-Deploy)

### Using GitHub Desktop (What You Already Use):

1. Make changes to your code locally
2. Open **GitHub Desktop**
3. Review changes
4. Write commit message
5. Click **"Commit to main"**
6. Click **"Push origin"**
7. **Vercel auto-deploys** in ~3 minutes! ✨

**No manual redeployment needed!**

---

## 📊 Your Deployed URLs

After deployment, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://laborlink-xxxx.vercel.app` | Main application |
| **Backend** | `https://laborlink-backend-xxxx.vercel.app` | API server |
| **Database** | Supabase Dashboard | Database management |

---

## 💰 Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| **Vercel** | **$0/month** | 100GB bandwidth, unlimited deployments |
| **Supabase** | **$0/month** | 500MB database, 2GB bandwidth |
| **Total** | **$0/month** | **Forever!** 🎉 |

**No credit card required. No expiration. No hidden fees.**

---

## ⚠️ Important Notes

### Vercel Free Tier
- ✅ 100GB bandwidth/month (plenty for demos)
- ✅ Unlimited deployments
- ✅ Auto-deploy from GitHub
- ✅ Custom domains supported

### Supabase Free Tier
- ✅ 500MB database (enough for thousands of users)
- ✅ 2GB bandwidth/month
- ✅ No expiration (unlike Render's 30 days!)
- ✅ Automatic backups

### Cold Starts
- ⚠️ Backend may have ~1-2 second delay on first request (serverless)
- Subsequent requests are fast
- This is normal for free tier

---

## 🐛 Troubleshooting

### Backend Not Working

**Check deployment logs:**
1. Go to Vercel → Backend project → "Deployments"
2. Click latest deployment → "View Function Logs"
3. Look for errors

**Common fixes:**
- Verify `DATABASE_URL` is correct (no spaces, includes password)
- Ensure all environment variables are set
- Check Python dependencies in `requirements.txt`

### Frontend Can't Connect to Backend

**Check:**
- `REACT_APP_API_URL` points to backend URL (no trailing slash)
- `CORS_ORIGINS` in backend includes frontend URL
- Both services are deployed successfully

**Test backend directly:**
- Visit: `https://your-backend-url.vercel.app/`
- Should see: `{"message": "Welcome to LaborLink API", "status": "active"}`

### Database Connection Errors

**Verify:**
- Supabase project is active (green status)
- Connection string has correct password
- Database tables were created (check SQL Editor)

### Can't Sign Up/Login

**Check:**
- Database migrations ran successfully
- Backend logs for errors
- Network tab in browser DevTools for API responses

---

## 🎓 Perfect for Students!

### Why This Setup is Great for CEP:

1. ✅ **Free forever** - won't expire before submission
2. ✅ **Live demo link** - share with professors
3. ✅ **Professional** - looks great on resume
4. ✅ **Portfolio ready** - keep it running after graduation
5. ✅ **Auto-deploy** - push to GitHub, instantly live

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## ✅ Final Checklist

After deployment:

- [ ] Frontend loads correctly
- [ ] Backend API accessible
- [ ] Can create user accounts
- [ ] Login works
- [ ] Database persists data
- [ ] Worker profile creation works
- [ ] Hirer can browse workers
- [ ] Hiring requests work
- [ ] Chat system functions
- [ ] Review system works
- [ ] Mobile responsive
- [ ] Auto-deploy enabled

---

## 🎉 Congratulations!

Your LaborLink application is now live on the internet - **100% FREE FOREVER!**

**Your app URLs:**
- 🌐 Frontend: `https://laborlink-xxxx.vercel.app`
- 🔧 Backend: `https://laborlink-backend-xxxx.vercel.app`
- 💾 Database: Supabase Dashboard

**Share it with the world!** 🚀
