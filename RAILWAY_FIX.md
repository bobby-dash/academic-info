# Railway Deployment - Quick Fix Applied

## ✅ What I Fixed

The Railway deployment was failing because it was trying to build from the root directory instead of the `backend` folder.

**Solution Applied:**
1. ✅ Created `railway.json` - Tells Railway to build from backend directory
2. ✅ Created `Procfile` - Tells Railway how to start the server
3. ✅ Pushed to GitHub - Railway will auto-redeploy

---

## 🔄 What's Happening Now

Railway is automatically redeploying your app with the new configuration. This should take 1-2 minutes.

**Check your Railway dashboard** - you should see a new deployment starting!

---

## ✅ After Successful Deployment

Once Railway shows "Deployment successful":

### 1. Generate Domain
- In Railway dashboard, go to **Settings**
- Scroll to **Domains** section
- Click **"Generate Domain"**
- Copy the URL (e.g., `https://academic-info-production.up.railway.app`)

### 2. Test Your Backend
```bash
# Health check
curl https://your-railway-url.up.railway.app/api/health

# Ask question
curl -X POST https://your-railway-url.up.railway.app/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "When is the next exam?"}'
```

### 3. Update n8n Workflow
- Edit HTTP Request node
- Change URL to: `https://your-railway-url.up.railway.app/api/ask`
- Save and activate

---

## 📁 Files Created

- **railway.json** - Railway build configuration
- **Procfile** - Start command for Railway

Both files are now in your GitHub repo and Railway is using them!

---

## 🐛 If It Still Fails

Check Railway logs for errors. Common issues:
- Missing environment variables
- Node.js version mismatch
- Port configuration

Make sure you added all environment variables in Railway dashboard:
- `PORT=5000`
- `NODE_ENV=production`
- `GOOGLE_SHEET_ID=...`
- `GOOGLE_API_KEY=...`
- `FRONTEND_URL=...`

---

**The deployment should succeed now!** Check your Railway dashboard. 🚀
