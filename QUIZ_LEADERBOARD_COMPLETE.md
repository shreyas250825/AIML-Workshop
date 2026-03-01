# Quiz Leaderboard - Complete Integration

## Overview
The quiz leaderboard now fetches data directly from your Google Apps Script, which handles sorting by score (highest first) and time (fastest first). The system displays all quiz participants with proper ranking.

## How It Works

### 1. Quiz Submission Flow
When a student completes a quiz:
1. Frontend sends data to `/api/quiz/submit`
2. API formats the data with these fields:
   - `name` - Student name
   - `regNo` - Registration number
   - `quizTitle` - Quiz title (e.g., "Day 1 Quiz")
   - `score` - Number of correct answers
   - `totalQuestions` - Total questions (15)
   - `timeTaken` - Formatted as "X min Y sec"
   - `submissionType` - "Manual" or "Auto (Time Up)"
3. Data is sent to Google Apps Script via POST
4. Google Apps Script appends the row to the active sheet

### 2. Leaderboard Display Flow
When viewing the leaderboard:
1. Frontend calls `/api/quiz/leaderboard`
2. That route calls `/api/quiz/leaderboard-proxy`
3. Proxy fetches from Google Apps Script via GET
4. Google Apps Script returns sorted data (already ranked by score/time)
5. API adds rank numbers (1, 2, 3, etc.)
6. Frontend displays with medals for top 2:
   - Rank 1: 🥇 Gold medal
   - Rank 2: 🥈 Silver medal
   - Rank 3: 🥉 Bronze medal
   - Others: Purple badge with rank number

### 3. Sorting Logic (in Google Apps Script)
```javascript
// Sort by score (descending), then by time (ascending)
data.sort((a, b) => {
  if (b[4] === a[4]) {
    // If scores are equal, faster time wins
    return parseTime(a[6]) - parseTime(b[6]);
  }
  return b[4] - a[4]; // Higher score wins
});
```

## Google Apps Script Code

Your Google Apps Script should have this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.regNo,
    data.quizTitle,
    data.score,
    data.totalQuestions,
    data.timeTaken,
    data.submissionType
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Remove header row
  data.shift();
  
  // Helper function to parse time string to seconds
  const parseTime = (timeStr) => {
    if (!timeStr) return 999999;
    const match = String(timeStr).match(/(\d+)\s*min\s*(\d+)\s*sec/);
    if (!match) return 999999;
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  };
  
  // Sort by score (descending), then by time (ascending)
  data.sort((a, b) => {
    const scoreA = Number(a[4]) || 0;
    const scoreB = Number(b[4]) || 0;
    
    if (scoreB === scoreA) {
      // If scores are equal, lower time wins (faster is better)
      const timeA = parseTime(a[6]);
      const timeB = parseTime(b[6]);
      return timeA - timeB;
    }
    // Higher score wins
    return scoreB - scoreA;
  });
  
  // Return all sorted data
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Google Sheets Structure

Your quiz sheet should have these columns:

| Column | Field | Example |
|--------|-------|---------|
| A | Timestamp | 3/1/2026 10:30:00 |
| B | Student Name | John Doe |
| C | Registration Number | CS001 |
| D | Quiz Title | Day 1 Quiz |
| E | Score | 12 |
| F | Total Questions | 15 |
| G | Time Taken | 8 min 45 sec |
| H | Submission Type | Manual |

## Features

### Leaderboard Page
- Shows all quiz participants (not limited to top 10)
- Auto-refreshes every 30 seconds
- Search functionality by name or registration number
- Visual ranking with medals for top 3
- Displays:
  - Rank (with medals for top 3)
  - Student name with avatar
  - Registration number
  - Score (e.g., "12 / 15")
  - Time taken (e.g., "8 min 45 sec")
  - Quiz title

### Stats Cards
- Quiz Participants count (purple card)
- Total Students count (green card)

## API Routes

### POST /api/quiz/submit
Submits quiz results to Google Sheets
- Formats time as "X min Y sec"
- Sends data with fields: name, regNo, quizTitle, score, totalQuestions, timeTaken, submissionType

### GET /api/quiz/leaderboard
Returns ranked leaderboard data
- Fetches from proxy
- Adds rank numbers
- Returns formatted objects

### GET /api/quiz/leaderboard-proxy
Proxies requests to Google Apps Script
- Converts array format to object format
- Handles CORS issues

## Files Modified

1. `workshop/app/api/quiz/submit/route.ts` - Updated field names to match Google Apps Script
2. `workshop/app/api/quiz/leaderboard-proxy/route.ts` - Added array-to-object conversion
3. `workshop/app/api/quiz/leaderboard/route.ts` - Simplified to just add ranks
4. `workshop/app/leaderboard/page.tsx` - Cleaned up to show only quiz leaderboard
5. `workshop/GOOGLE_APPS_SCRIPT_QUIZ.js` - Updated with your sorting logic

## Testing

1. Submit a quiz result
2. Check your Google Sheet - new row should appear
3. Go to leaderboard page
4. You should see all quiz results sorted by score/time
5. Top 2 should have gold and silver medals

## Troubleshooting

### No data showing
- Check browser console for errors
- Verify Google Apps Script URL is correct
- Test the script URL directly in browser - should return JSON array
- Check that sheet has data (not just headers)

### Wrong sorting
- Verify time format is "X min Y sec" in the sheet
- Check that score column contains numbers, not text

### Data not updating
- Leaderboard auto-refreshes every 30 seconds
- Manually refresh the page to force update
- Check that Google Apps Script is deployed as "Anyone" can access
