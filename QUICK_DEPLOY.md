# Quick Start: Deploy LaborLink to Render

This is a condensed quick-reference guide. For detailed explanations, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Prerequisites
- ✅ GitHub account
- ✅ Render account (sign up free at [render.com](https://render.com))
- ✅ Code pushed to GitHub

---

## Step 1: Push to GitHub

```bash
cd d:\IUB_Data\5th Sem\Python\Project\CEP_LaborLink\CEP_LaborLink\CEPLabor_Link_Python
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

## Step 2: Create PostgreSQL Database

1. Render Dashboard → **New +** → **PostgreSQL**
2. Settings:
   - **Name**: `laborlink-db`
   - **Database**: `laborlink`
   - **Plan**: **Free**
3. Click **Create Database**
4. **Copy Internal Database URL** (starts with `postgresql://...`)

---

## Step 3: Deploy Backend

1. Render Dashboard → **New +** → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Name**: `laborlink-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `chmod +x ./build.sh && ./build.sh`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free**

4. **Environment Variables** (Add these):
```
DATABASE_URL = <paste your PostgreSQL Internal Database URL>
SECRET_KEY = <generate random: openssl rand -hex 32>
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
CORS_ORIGINS = <leave empty for now>
```

5. Click **Create Web Service**
6. **Copy backend URL** (e.g., `https://laborlink-backend.onrender.com`)

---

## Step 4: Deploy Frontend

1. Render Dashboard → **New +** → **Static Site**
2. Connect your GitHub repo
3. Settings:
   - **Name**: `laborlink-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: **Free**

4. **Environment Variable**:
```
REACT_APP_API_URL = <your backend URL from Step 3>
```

5. Click **Create Static Site**
6. **Copy frontend URL** (e.g., `https://laborlink-frontend.onrender.com`)

---

## Step 5: Update CORS

1. Go to backend service → **Environment**
2. Edit `CORS_ORIGINS` variable
3. Set value to: `<your frontend URL from Step 4>`
4. Save (backend will auto-redeploy)

---

## Step 6: Test Your App! 🎉

Visit your frontend URL and test:
- ✅ User signup (worker & hirer)
- ✅ Worker profile creation
- ✅ Browse workers
- ✅ Hiring flow
- ✅ Chat messaging
- ✅ Reviews

---

## Your Deployed URLs

| Service | URL |
|---------|-----|
| **Frontend** | `https://laborlink-frontend.onrender.com` |
| **Backend** | `https://laborlink-backend.onrender.com` |
| **API Docs** | `https://laborlink-backend.onrender.com/docs` |

---

## Troubleshooting

### ❌ Backend won't start
- Check Render logs for errors
- Verify `DATABASE_URL` is the **Internal** URL (not External)
- Ensure `SECRET_KEY` is set

### ❌ Frontend can't connect
- Verify `REACT_APP_API_URL` matches backend URL
- Check `CORS_ORIGINS` includes frontend URL
- Test backend directly at `/docs` endpoint

### ⏱️ App is slow
- Normal for free tier: 30s cold start after 15min idle
- Upgrade to paid plan ($7/month) to eliminate cold starts

---

## Auto-Deploy

✅ Every git push automatically deploys to Render!

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main
# ↑ Render auto-deploys in 5-10 minutes
```

---

## Need More Help?

📖 See full guide: [DEPLOYMENT.md](DEPLOYMENT.md)
🌐 Render Docs: [docs.render.com](https://docs.render.com)
