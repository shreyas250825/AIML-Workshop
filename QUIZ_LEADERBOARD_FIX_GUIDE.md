# Quiz Leaderboard Fix Guide

## Problem
The quiz leaderboard is not displaying the 3 students' quiz results from your Google Sheets. The Google Apps Script at the quiz URL is currently returning user registration data instead of quiz data.

## Root Cause
The Google Apps Script at this URL:
```
https://script.google.com/macros/s/AKfycby7RWePhH2TyrdUXzq3AFVfwCYpLlnTpfsD2chErov4buxVKhTKarKcDk-gHNeJr2Y/exec
```

...is reading from the wrong sheet. It needs to read from "Quiz Data" sheet, not "Users" sheet.

## Solution

### Step 1: Open Your Quiz Google Apps Script

1. Go to your Quiz spreadsheet (the one with "Quiz Data" sheet containing the 3 students' results)
2. Click **Extensions** → **Apps Script**
3. You should see the script editor

### Step 2: Replace the Code

**IMPORTANT**: Delete ALL existing code in the script editor and replace it with the code below:

```javascript
// ============================================
// QUIZ GOOGLE APPS SCRIPT CODE
// This is for the QUIZ spreadsheet (separate from auth)
// ============================================

// ---------------- POST HANDLER (Submit Quiz) ----------------
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Get the Quiz Data sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Quiz Data");
    if (!sheet) {
      return jsonResponse({ 
        success: false, 
        error: "Quiz Data sheet not found" 
      });
    }
    
    // Append quiz submission
    sheet.appendRow([
      data.submittedAt || new Date(),
      data.studentName || '',
      data.registrationNumber || '',
      data.quizTitle || '',
      data.score || 0,
      data.totalQuestions || 15,
      data.timeTaken || '',
      data.submissionType || 'manual'
    ]);
    
    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ 
      success: false, 
      error: error.toString() 
    });
  }
}

// ---------------- GET HANDLER (Get Quiz Leaderboard) ----------------
function doGet(e) {
  try {
    // Get the Quiz Data sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Quiz Data");
    if (!sheet) {
      return jsonResponse([]);
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and convert to objects
    const quizResults = [];
    for (let i = 1; i < data.length; i++) {
      quizResults.push({
        submittedAt: data[i][0],
        studentName: data[i][1],
        registrationNumber: data[i][2],
        quizTitle: data[i][3],
        score: data[i][4],
        totalQuestions: data[i][5],
        timeTaken: data[i][6],
        submissionType: data[i][7]
      });
    }
    
    return jsonResponse(quizResults);
  } catch (error) {
    return jsonResponse([]);
  }
}

// ---------------- HELPER ----------------
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Step 3: Deploy the Script

1. Click the **Deploy** button (top right)
2. Select **Manage deployments**
3. Click the **Edit** icon (pencil) next to your existing deployment
4. Under "New description", add something like "Fixed to read Quiz Data sheet"
5. Click **Deploy**
6. Copy the new Web app URL (it should be the same as before)

### Step 4: Verify Your Sheet Structure

Make sure your "Quiz Data" sheet has these columns in this exact order:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
|----------|----------|----------|----------|----------|----------|----------|----------|
| Submitted At | Student Name | Registration Number | Quiz Title | Score | Total Questions | Time Taken | Submission Type |

Example data row:
```
3/1/2026 10:30:00 | John Doe | CS001 | Day 1 Quiz | 12 | 15 | 8 min 45 sec | manual
```

### Step 5: Test the Leaderboard

1. Go to your workshop application
2. Navigate to the Leaderboard page
3. You should now see the 3 students' quiz results displayed
4. The leaderboard will auto-refresh every 30 seconds

## Troubleshooting

### If you still don't see data:

1. **Check the sheet name**: Make sure it's exactly "Quiz Data" (case-sensitive)
2. **Check the data**: Make sure you have at least one row of data below the header
3. **Check the browser console**: Open Developer Tools (F12) and look for any error messages
4. **Test the script directly**: 
   - Copy your Google Apps Script URL
   - Paste it in a new browser tab
   - You should see JSON data with your quiz results
   - If you see HTML or an error, the script isn't working correctly

### If the script returns an error:

1. Make sure you deployed the script as a **Web app**
2. Make sure "Execute as" is set to **Me**
3. Make sure "Who has access" is set to **Anyone**

## What Changed

The leaderboard page now:
- Shows ONLY quiz rankings (removed the registrations tab)
- Displays quiz participants count
- Auto-refreshes every 30 seconds
- Ranks students by score (highest first), then by time (fastest first)
- Shows the best attempt for each student if they took the quiz multiple times

## Files Modified

- `workshop/app/leaderboard/page.tsx` - Cleaned up to show only quiz leaderboard
- `workshop/app/api/quiz/leaderboard/route.ts` - Processes and ranks quiz data
- `workshop/app/api/quiz/leaderboard-proxy/route.ts` - Fetches data from Google Apps Script

## Reference Files

- `workshop/GOOGLE_APPS_SCRIPT_QUIZ.js` - The correct code for your quiz script
- `workshop/GOOGLE_APPS_SCRIPT_COMPLETE.js` - The auth script (different spreadsheet)
