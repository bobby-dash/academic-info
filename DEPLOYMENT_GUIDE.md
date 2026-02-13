# Deployment Guide - Academic Assistant

## 🚀 Quick Deployment Options

### **Option 1: Railway (Recommended - Easiest)**

Railway is the easiest way to deploy Node.js backends with zero configuration.

#### **Steps:**

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Connect your GitHub account
   - Select your repository (or create one first)
   - Railway auto-detects Node.js and deploys!

3. **Add Environment Variables**
   - In Railway dashboard, go to your project
   - Click **"Variables"** tab
   - Add these variables:
     ```
     PORT=5000
     NODE_ENV=production
     GOOGLE_SHEET_ID=your_sheet_id
     GOOGLE_API_KEY=your_api_key
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```

4. **Get Your Public URL**
   - Railway automatically generates a URL like: `https://your-app.railway.app`
   - Copy this URL

5. **Update n8n Workflow**
   - Change HTTP Request URL from `http://localhost:5000/api/ask`
   - To: `https://your-app.railway.app/api/ask`

**Cost:** Free tier available (500 hours/month)

---

### **Option 2: Render**

Another great free option with similar ease of use.

#### **Steps:**

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Settings:
     - **Name**: `academic-assistant-backend`
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`

3. **Add Environment Variables**
   - In the dashboard, add:
     ```
     PORT=5000
     NODE_ENV=production
     GOOGLE_SHEET_ID=your_sheet_id
     GOOGLE_API_KEY=your_api_key
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Render will build and deploy
   - You'll get a URL like: `https://academic-assistant-backend.onrender.com`

**Cost:** Free tier available (spins down after inactivity)

---

### **Option 3: Vercel (Backend + Frontend Together)**

Deploy both frontend and backend together.

#### **Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json` in root**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/server.js",
         "use": "@vercel/node"
       },
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "frontend/$1"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all your `.env` variables

**Cost:** Free tier available

---

### **Option 4: Heroku**

Classic platform, reliable but requires credit card for free tier.

#### **Steps:**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   cd backend
   heroku create academic-assistant-backend
   ```

4. **Add Procfile**
   Create `backend/Procfile`:
   ```
   web: node server.js
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set GOOGLE_SHEET_ID=your_sheet_id
   heroku config:set GOOGLE_API_KEY=your_api_key
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

**Cost:** Free tier with credit card verification

---

## 🎯 Recommended Approach for Hackathon

### **Backend: Railway** (5 minutes)
- Fastest deployment
- No configuration needed
- Free tier

### **Frontend: Vercel** (3 minutes)
- Perfect for React apps
- Automatic builds
- Free tier

---

## 📝 Step-by-Step: Railway + Vercel

### **Part 1: Deploy Backend to Railway**

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/academic-assistant.git
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repo
   - Railway auto-deploys!

3. **Configure**
   - Add environment variables
   - Get your Railway URL: `https://academic-assistant-production.up.railway.app`

### **Part 2: Deploy Frontend to Vercel**

1. **Update Frontend API URL**
   
   Edit `frontend/src/App.jsx` line 32:
   ```javascript
   const response = await axios.post('https://your-railway-url.railway.app/api/ask', {
       question: queryText
   });
   ```

2. **Deploy**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

3. **Done!**
   - Frontend URL: `https://academic-assistant.vercel.app`
   - Backend URL: `https://your-app.railway.app`

---

## 🔄 Update n8n After Deployment

Once backend is deployed:

1. **Update HTTP Request Node in n8n**
   - URL: `https://your-railway-url.railway.app/api/ask`

2. **Update Frontend (if using n8n)**
   - Change to n8n webhook URL
   - Or keep using direct backend URL

---

## 🧪 Testing Deployed Backend

```bash
# Test health endpoint
curl https://your-railway-url.railway.app/api/health

# Test ask endpoint
curl -X POST https://your-railway-url.railway.app/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "When is the next exam?"}'
```

---

## 🎉 Final Architecture (Deployed)

```
┌─────────────────────────────┐
│  Frontend (Vercel)          │
│  academic-assistant.vercel  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  n8n Webhook (Optional)     │
│  dhairya78.app.n8n.cloud    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Backend (Railway)          │
│  your-app.railway.app       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Google Sheets              │
└─────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Use Railway for backend** - It's the easiest
2. **Use Vercel for frontend** - Perfect for React
3. **Keep environment variables secure** - Never commit `.env`
4. **Test locally first** - Make sure everything works
5. **Monitor logs** - Check Railway/Vercel dashboards for errors

---

**Need help with deployment?** Let me know which platform you choose!
