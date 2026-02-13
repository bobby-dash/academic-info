import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Google Sheets Setup
const sheets = google.sheets('v4');
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Mock data for when Google Sheets API is not available
 */
const MOCK_DATA = [
  ['Exam Schedule', 'exam, test, midterm, final, next exam', 'The next exam is Mathematics on March 15, 2026 at 9:00 AM in Hall A. Please arrive 15 minutes early.', '2026-02-13', '2026-03-15'],
  ['Events', 'event, fest, cultural, technical, this week', 'This week\'s events: Guest Lecture on AI (Feb 14), Coding Workshop (Feb 15), Sports Day (Feb 16).', '2026-02-13', '2026-02-14'],
  ['Timetable', 'class, schedule, timetable, today, lecture', 'Today\'s schedule: 9 AM - Mathematics (Room 101), 11 AM - Physics Lab (Lab 2), 2 PM - Chemistry (Room 203).', '2026-02-13', '2026-02-13'],
  ['Holidays', 'holiday, vacation, break, upcoming', 'Upcoming holidays: Holi (March 14), Spring Break (March 25-30, 2026). Total 8 holidays this semester.', '2026-02-13', '2026-03-14'],
  ['General', 'help, info, about, hi, hello', 'I can help you with exam schedules, events, timetables, holidays, and more. Just ask!', '2026-02-13', '']
];

/**
 * Fetch data from Google Sheets
 */
async function getSheetData(range = 'AcademicData!A2:E100') {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range,
      key: API_KEY,
    });

    return response.data.values || [];
  } catch (error) {
    console.error('⚠️  Google Sheets API Error:', error.message);
    console.log('📝 Using mock data instead. Enable Google Sheets API to use real data.');
    // Return mock data as fallback
    return MOCK_DATA;
  }
}

/**
 * Calculate keyword match score
 */
function calculateMatchScore(question, keywords) {
  const questionLower = question.toLowerCase();
  const questionWords = questionLower.split(/\s+/);
  const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());

  let score = 0;

  for (const keyword of keywordList) {
    // Exact phrase match
    if (questionLower.includes(keyword)) {
      score += 10;
    } else {
      // Individual word matches
      for (const word of questionWords) {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 3;
        }
      }
    }
  }

  return score;
}

/**
 * Check if date is relevant (today, tomorrow, this week)
 */
function isDateRelevant(dateStr, query) {
  if (!dateStr) return false;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const queryLower = query.toLowerCase();
  const targetDate = new Date(dateStr);

  // Check for "today"
  if (queryLower.includes('today')) {
    return targetDate.toDateString() === today.toDateString();
  }

  // Check for "tomorrow"
  if (queryLower.includes('tomorrow')) {
    return targetDate.toDateString() === tomorrow.toDateString();
  }

  // Check for "this week"
  if (queryLower.includes('this week') || queryLower.includes('week')) {
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return targetDate >= today && targetDate <= weekFromNow;
  }

  // Check for "next"
  if (queryLower.includes('next')) {
    return targetDate >= today;
  }

  return true;
}

/**
 * Search for answer in sheet data
 */
function searchAnswer(question, sheetData) {
  let bestMatch = null;
  let highestScore = 0;

  for (const row of sheetData) {
    const [category, keywords, answer, lastUpdated, date] = row;

    // Skip if no keywords or answer
    if (!keywords || !answer) continue;

    // Calculate base score
    let score = calculateMatchScore(question, keywords);

    // Boost score for date-relevant entries
    if (date && isDateRelevant(date, question)) {
      score += 15;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = {
        category: category || 'General',
        answer,
        lastUpdated: lastUpdated || new Date().toISOString(),
        date: date || null,
        matchScore: score
      };
    }
  }

  // Return result
  if (bestMatch && highestScore > 5) {
    return {
      found: true,
      answer: bestMatch.answer,
      category: bestMatch.category,
      confidence: highestScore > 15 ? 'high' : 'medium',
      matchScore: highestScore,
      date: bestMatch.date
    };
  } else {
    return {
      found: false,
      answer: "I'm sorry, I couldn't find a specific answer to your question. Please try asking about exam schedules, events, timetables, or holidays.",
      category: 'unknown',
      confidence: 'low',
      matchScore: 0
    };
  }
}

// ==================== API ROUTES ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Academic Assistant Backend is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get all academic data (for testing)
 */
app.get('/api/data', async (req, res) => {
  try {
    const data = await getSheetData();
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Ask a question - Main endpoint
 */
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    // Fetch data from Google Sheets
    const sheetData = await getSheetData();

    // Search for answer
    const result = searchAnswer(question, sheetData);

    res.json({
      success: true,
      question,
      ...result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process question',
      message: error.message
    });
  }
});

/**
 * Get data by category
 */
app.get('/api/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const data = await getSheetData();

    const filtered = data.filter(row =>
      row[0] && row[0].toLowerCase() === category.toLowerCase()
    );

    res.json({
      success: true,
      category,
      count: filtered.length,
      data: filtered.map(row => ({
        category: row[0],
        keywords: row[1],
        answer: row[2],
        lastUpdated: row[3],
        date: row[4]
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Forward to n8n webhook (optional - for testing n8n integration)
 */
app.post('/api/n8n/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const n8nUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nUrl) {
      return res.status(500).json({
        success: false,
        error: 'n8n webhook URL not configured'
      });
    }

    const response = await axios.post(n8nUrl, { question });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to communicate with n8n',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Academic Assistant Backend running on port ${PORT}`);
  console.log(`📊 Google Sheets ID: ${SHEET_ID ? 'Configured' : 'Not configured'}`);
  console.log(`🔗 n8n Webhook: ${process.env.N8N_WEBHOOK_URL ? 'Configured' : 'Not configured'}`);
});
