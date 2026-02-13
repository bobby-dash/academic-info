# Fix Google Sheets API Error

## Error Message
```
Error fetching sheet data: Google Sheets API has not been enabled
```

## Solution: Enable Google Sheets API

### Step 1: Go to Google Cloud Console
1. Open [Google Cloud Console](https://console.cloud.google.com)
2. Sign in with your Google account

### Step 2: Select or Create Project
1. Click the project dropdown at the top
2. Either select your existing project or click **NEW PROJECT**
3. If creating new:
   - Name: "Academic Assistant"
   - Click **CREATE**

### Step 3: Enable Google Sheets API
1. In the left sidebar, click **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on **Google Sheets API**
4. Click the **ENABLE** button
5. Wait for it to enable (takes a few seconds)

### Step 4: Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy the API key that appears
4. Click **RESTRICT KEY** (recommended)
5. Under "API restrictions":
   - Select **Restrict key**
   - Check **Google Sheets API**
6. Click **SAVE**

### Step 5: Update Your .env File
Replace the API key in `backend/.env`:

```env
GOOGLE_API_KEY=your_new_api_key_here
```

### Step 6: Restart Backend
```bash
# Stop the backend (Ctrl+C)
# Start it again
npm run dev
```

## Alternative: Use Service Account (More Secure)

If you want better security, use a Service Account instead of API Key:

1. **Create Service Account**:
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **Service Account**
   - Name: "academic-assistant-sa"
   - Click **CREATE AND CONTINUE**
   - Skip optional steps, click **DONE**

2. **Create Key**:
   - Click on the service account you just created
   - Go to **KEYS** tab
   - Click **ADD KEY** → **Create new key**
   - Choose **JSON**
   - Download the JSON file

3. **Share Google Sheet**:
   - Open your Google Sheet
   - Click **Share**
   - Add the service account email (looks like: `academic-assistant-sa@project-id.iam.gserviceaccount.com`)
   - Give **Viewer** permission

4. **Update Backend Code** (if using service account):
   This requires code changes - stick with API Key for now if you want simplicity.

## Quick Test

After enabling the API and updating the key, test:

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Academic Assistant Backend is running",
  "timestamp": "..."
}
```

Then test data fetch:
```bash
curl http://localhost:5000/api/data
```

Should return your academic data!
