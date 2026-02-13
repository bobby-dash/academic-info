# n8n Webhook Integration - Complete Setup

## Current Status
✅ App is working with direct backend API  
✅ Mock data is functioning  
⚠️ n8n webhook not being called (frontend uses direct API)  

## Why n8n Webhook Isn't Being Called

Your frontend is currently configured to call the **direct backend API** (`/api/ask`), not the n8n webhook. This was intentional to avoid CORS issues.

---

## Option 1: Keep Using Direct Backend (Recommended for Now)

**Pros:**
- ✅ Already working
- ✅ No CORS issues
- ✅ Simpler architecture
- ✅ Faster responses

**When to use:** Development, testing, local deployment

---

## Option 2: Use n8n Webhook (For Production/Advanced Features)

**Pros:**
- ✅ Centralized logging
- ✅ Can add AI processing (OpenAI, Gemini)
- ✅ Can trigger notifications
- ✅ Visual workflow management

**Cons:**
- ⚠️ Requires CORS configuration
- ⚠️ Slightly slower (extra hop)
- ⚠️ More complex setup

---

## How to Enable n8n Webhook

### Step 1: Fix CORS in n8n Workflow

Your n8n workflow needs to handle CORS. Here's the **updated 4-node workflow**:

#### **Node 1: Webhook Trigger**
- **Type**: Webhook
- **HTTP Method**: `POST`
- **Path**: `question-webhook`
- **Response Mode**: `Respond to Webhook`

#### **Node 2: Code - Add CORS Headers**
- **Type**: Code
- **Mode**: Run Once for All Items
- **JavaScript Code**:
```javascript
// Extract question from request
const question = $input.item.json.body.question || $input.item.json.question;

// Set CORS headers
return [{
  json: {
    question: question,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }
}];
```

#### **Node 3: HTTP Request to Backend**
- **Type**: HTTP Request
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/ask`
- **Send Body**: ✅ Enabled
- **Body Content Type**: `JSON`
- **Specify Body**: Using Fields Below
  - **Field Name**: `question`
  - **Field Value**: `{{ $json.question }}`

#### **Node 4: Respond to Webhook**
- **Type**: Respond to Webhook
- **Response Code**: `200`
- **Respond With**: Using Fields Below
  - Add all fields from HTTP Request response
- **Options** → **Response Headers**: 
  - Add from expression: `{{ $('Code - Add CORS Headers').item.json.headers }}`

### Step 2: Connect Nodes
```
Webhook → Code (CORS) → HTTP Request → Respond to Webhook
```

### Step 3: Save & Activate
1. Click **"Save"**
2. Toggle **"Active"** to ON

---

## Step 4: Update Frontend to Use n8n

Edit `frontend/src/App.jsx` line 32:

**Change from:**
```javascript
const response = await axios.post('/api/ask', {
    question: queryText
});
```

**Change to:**
```javascript
const response = await axios.post('https://dhairya78.app.n8n.cloud/webhook/question-webhook', {
    question: queryText
});
```

---

## Alternative: Handle CORS with Preflight

If the above doesn't work, you need to handle OPTIONS requests:

### **Updated Webhook Node Settings**
- **HTTP Method**: `POST, OPTIONS` (select both)

### **Add Code Node After Webhook**
```javascript
// Handle OPTIONS preflight
if ($input.item.json.method === 'OPTIONS') {
  return [{
    json: {},
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }];
}

// Handle POST request
const question = $input.item.json.body.question;
return [{ json: { question } }];
```

---

## Testing n8n Webhook

### Test 1: Direct curl (from terminal)
```bash
curl -X POST https://dhairya78.app.n8n.cloud/webhook/question-webhook \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"When is the next exam?\"}"
```

Should return academic data!

### Test 2: From Frontend
1. Update `App.jsx` to use n8n URL
2. Open http://localhost:5173
3. Ask a question
4. Check n8n workflow executions

---

## Troubleshooting

### Issue: CORS Error
**Solution**: Make sure CORS headers are set in the Respond to Webhook node

### Issue: Webhook not triggering
**Solution**: 
1. Check workflow is Active
2. Verify webhook URL is correct
3. Check n8n execution logs

### Issue: 404 Not Found
**Solution**: Webhook path must match exactly: `question-webhook`

---

## Recommendation

**For your hackathon/demo:**
- ✅ **Keep using direct backend** (current setup)
- ✅ It's simpler and already working
- ✅ Show n8n workflow as "future enhancement"

**For production:**
- ✅ Use n8n for advanced features
- ✅ Add logging, AI processing, notifications
- ✅ Deploy backend to a public URL (not localhost)

---

## Current Architecture (Working)

```
┌─────────────┐
│   React     │
│  Frontend   │
└──────┬──────┘
       │ /api/ask
       ▼
┌─────────────┐      ┌────────────────┐
│   Express   │─────▶│  Google Sheets │
│   Backend   │      │   (Mock Data)  │
└─────────────┘      └────────────────┘
```

## With n8n (Optional)

```
┌─────────────┐
│   React     │
│  Frontend   │
└──────┬──────┘
       │ webhook
       ▼
┌─────────────┐
│     n8n     │
│  Workflow   │
└──────┬──────┘
       │ /api/ask
       ▼
┌─────────────┐      ┌────────────────┐
│   Express   │─────▶│  Google Sheets │
│   Backend   │      │   (Mock Data)  │
└─────────────┘      └────────────────┘
```

---

**Your app is fully functional right now!** n8n is optional for advanced features. 🚀
