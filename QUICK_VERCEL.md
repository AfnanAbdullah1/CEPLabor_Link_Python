# Quick Deploy to Vercel + Supabase

**100% FREE FOREVER** - No credit card, no expiration!

---

## ⚡ Super Quick Steps

### 1. Supabase (5 min)
1. Go to [supabase.com](https://supabase.com) → Sign up with GitHub
2. Create project → Save password
3. Get connection string: **Settings** → **Database** → **URI**
4. Run SQL: **SQL Editor** → Copy `supabase_schema.sql` content → Run
5. ✅ Done!

### 2. Backend on Vercel (10 min)
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **New Project** → Import your repo
3. **Root Directory**: `backend`
4. **Add Environment Variables**:
   ```
   DATABASE_URL = <Supabase connection string>
   SECRET_KEY = <generate with: openssl rand -hex 32>
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   CORS_ORIGINS = <leave empty>
   ```
5. **Deploy** → Copy backend URL
6. ✅ Done!

### 3. Frontend on Vercel (10 min)
1. **New Project** → Same repo again
2. **Root Directory**: `frontend`
3. **Add Environment Variable**:
   ```
   REACT_APP_API_URL = <your backend URL>
   ```
4. **Deploy** → Copy frontend URL
5. ✅ Done!

### 4. Update CORS (2 min)
1. Backend project → **Settings** → **Environment Variables**
2. Edit `CORS_ORIGINS` → Set to frontend URL
3. **Redeploy**
4. ✅ Done!

### 5. Test! 🎉
- Open frontend URL
- Create account
- Test features
- Share with world!

---

## 📱 Your Live URLs

After deployment:
- Frontend: `https://laborlink-xxxx.vercel.app`
- Backend: `https://laborlink-backend-xxxx.vercel.app`

**Cost:** $0/month forever!

---

## 🔄 Auto-Deploy

1. Make changes locally
2. GitHub Desktop → Commit → Push
3. Vercel auto-deploys! ✨

---

**Full guide:** See `VERCEL_DEPLOYMENT.md` for detailed instructions
