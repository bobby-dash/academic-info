# Academic Assistant - Full-Stack Application

## 🎯 Problem Statement

Students frequently need quick answers to academic questions like:
- When is the mid-term examination?
- Is there any academic event this week?
- What is today's lecture schedule?
- What does the academic calendar say about upcoming exams?

Currently, students depend on notice boards, manual faculty inquiries, and messaging groups, leading to:
- ❌ Delayed information
- ❌ Repeated questioning
- ❌ Miscommunication
- ❌ Missed deadlines

## ✅ Solution

A centralized, automated system that provides **real-time academic information** through:
- 🌐 Modern React web interface
- 🚀 Node.js/Express backend
- 📊 Google Sheets as data source
- 🔄 n8n workflow automation

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│   React     │─────▶│   Express    │─────▶│ Google Sheets  │
│  Frontend   │      │   Backend    │      │   (Data)       │
│  (Port 5173)│◀─────│  (Port 5000) │◀─────│                │
└─────────────┘      └──────────────┘      └────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  n8n Workflow│
                     │   (Optional) │
                     └──────────────┘
```

---

## 📁 Project Structure

```
Hackathon/
├── backend/
│   ├── server.js              # Express server with Google Sheets API
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css            # Styles
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Frontend dependencies
├── academic_data_complete.csv # Google Sheets data template
├── package.json               # Root package.json
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud account (for Sheets API)
- n8n account (optional)

### Step 1: Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Set Up Google Sheets

1. **Create a Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet named "Academic Data"
   - Import `academic_data_complete.csv` or copy the data

2. **Get Google Sheets API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable "Google Sheets API"
   - Create credentials → API Key
   - Copy the API key

3. **Make Sheet Public** (or use Service Account):
   - Click "Share" in Google Sheets
   - Change to "Anyone with the link can view"
   - Copy the Sheet ID from the URL

### Step 3: Configure Environment

```bash
# Copy environment template
cd backend
cp .env.example .env
```

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development

# Google Sheets Configuration
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_API_KEY=your_api_key_here

# n8n Webhook (optional)
N8N_WEBHOOK_URL=https://dhairya78.app.n8n.cloud/webhook/question-webhook

# CORS
FRONTEND_URL=http://localhost:5173
```

### Step 4: Run the Application

**Option 1: Run Both (Frontend + Backend)**
```bash
# From root directory
npm run dev
```

**Option 2: Run Separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 📊 Google Sheets Data Format

Your Google Sheet should have these columns:

| Column | Name | Description | Example |
|--------|------|-------------|---------|
| A | Category | Type of information | "Exam Schedule" |
| B | Keywords | Search keywords (comma-separated) | "exam, test, midterm" |
| C | Answer | The response text | "Next exam is on March 15..." |
| D | Last Updated | Update timestamp | "2026-02-13" |
| E | Date | Relevant date (optional) | "2026-03-15" |

**Sheet Name**: `AcademicData`  
**Range**: `A2:E100` (row 1 is headers)

---

## 🔌 API Endpoints

### Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/data` | Get all academic data |
| POST | `/api/ask` | Ask a question |
| GET | `/api/category/:category` | Get data by category |
| POST | `/api/n8n/ask` | Forward to n8n webhook |

### Example Request

```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "When is the next exam?"}'
```

### Example Response

```json
{
  "success": true,
  "question": "When is the next exam?",
  "found": true,
  "answer": "The next exam is Mathematics on March 15, 2026 at 9:00 AM in Hall A.",
  "category": "Exam Schedule",
  "confidence": "high",
  "matchScore": 25,
  "date": "2026-03-15",
  "timestamp": "2026-02-13T07:03:21.000Z"
}
```

---

## 🔄 n8n Workflow Setup (Optional)

For detailed n8n configuration, see:
- **Workflow Guide**: `brain/n8n_workflow_guide.md`
- **Node Configuration**: `brain/n8n_workflow_nodes.md`

### Quick n8n Setup

1. Create new workflow in n8n
2. Add Webhook Trigger node (path: `question-webhook`)
3. Add HTTP Request node (URL: `http://localhost:5000/api/ask`)
4. Add Respond to Webhook node
5. Activate workflow
6. Update webhook URL in `.env`

---

## 🎨 Features

### Frontend Features
- ✨ Modern, responsive UI with glassmorphism design
- 🎯 Quick category buttons (Exams, Events, Timetable, Holidays)
- 💬 Real-time question answering
- 📱 Mobile-friendly responsive design
- 🎭 Loading states and error handling
- 🏷️ Confidence badges and category tags

### Backend Features
- 🔍 Intelligent keyword matching
- 📅 Date-aware queries ("today", "tomorrow", "this week")
- 🎯 Category-based search
- 📊 Google Sheets integration
- 🔄 n8n webhook support
- ⚡ Fast response times

---

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Ask a question
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What events are happening this week?"}'

# Get all data
curl http://localhost:5000/api/data
```

### Test Frontend

1. Open http://localhost:5173
2. Click a category button
3. Or type a custom question
4. Verify answer appears correctly

---

## 🔧 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists and is configured
- Check Google Sheets API key is valid

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.js`

### No answers from Google Sheets
- Verify Sheet ID is correct
- Check if sheet is publicly accessible
- Ensure sheet name is "AcademicData"
- Verify data format matches template

### Low match scores
- Add more keywords to Google Sheets
- Check spelling in questions
- Verify keywords are comma-separated

---

## 📦 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy 'dist' folder
```

### Backend (Heroku/Railway)

```bash
cd backend
# Add Procfile: web: node server.js
# Deploy with environment variables
```

---

## 🔐 Security Notes

> **Important**: Never commit `.env` files to version control

- Use environment variables for sensitive data
- Implement rate limiting in production
- Use HTTPS for all connections
- Validate all user inputs
- Consider using Service Account for Google Sheets

---

## 📈 Future Enhancements

- [ ] User authentication
- [ ] Admin panel for data management
- [ ] Push notifications for important updates
- [ ] Mobile app (React Native)
- [ ] AI-powered responses (Gemini API)
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Voice input support

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use for your institution!

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the n8n workflow documentation
- Contact your system administrator

---

## 🎓 Built For Students, By Students

Made with ❤️ to solve real academic information problems.

**Happy Learning! 📚**
