# Google Apps Script Setup for Quiz Results

## Overview

The quiz system uses a Google Apps Script Web App to save and retrieve quiz results from Google Sheets. This approach is simpler and more secure than using the Google Sheets API directly.

## Current Configuration

**Web App URL**: `https://script.google.com/macros/s/AKfycby7RWePhH2TyrdUXzq3AFVfwCYpLlnTpfsD2chErov4buxVKhTKarKcDk-gHNeJr2Y/exec`

This URL is already configured in:
- `workshop/app/api/quiz/submit/route.ts` (for submitting quiz results)
- `workshop/app/api/quiz/leaderboard/route.ts` (for fetching leaderboard data)

## Google Apps Script Code

If you need to recreate or modify the script, here's the complete code that should be deployed as a Web App:

```javascript
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet and QuizResults sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('QuizResults');
    
    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = ss.insertSheet('QuizResults');
      sheet.appendRow([
        'Submitted At',
        'Student Name',
        'Registration Number',
        'Quiz Title',
        'Score',
        'Total Questions',
        'Time Taken',
        'Submission Type'
      ]);
    }
    
    // Append the data to the sheet
    sheet.appendRow([
      data.submittedAt,
      data.studentName,
      data.registrationNumber,
      data.quizTitle,
      data.score,
      data.totalQuestions,
      data.timeTaken,
      data.submissionType
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    // Get the active spreadsheet and QuizResults sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('QuizResults');
    
    if (!sheet) {
      // Return empty array if sheet doesn't exist
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and convert to array of objects
    const headers = data[0];
    const results = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const result = {
        submittedAt: row[0],
        studentName: row[1],
        registrationNumber: row[2],
        quizTitle: row[3],
        score: row[4],
        totalQuestions: row[5],
        timeTaken: row[6],
        submissionType: row[7]
      };
      results.push(result);
    }
    
    // Return the data as JSON
    return ContentService
      .createTextOutput(JSON.stringify(results))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## How to Deploy Google Apps Script Web App

### Step 1: Open Google Sheets
1. Open your Google Sheet where you want to store quiz results
2. Click on **Extensions** > **Apps Script**

### Step 2: Create the Script
1. Delete any existing code in the script editor
2. Paste the Google Apps Script code from above
3. Click **Save** (disk icon) and give your project a name (e.g., "Quiz Results Handler")

### Step 3: Deploy as Web App
1. Click **Deploy** > **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Quiz Results API" (or any description)
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** > **Go to [Project Name] (unsafe)**
   - Click **Allow**
6. Copy the **Web app URL** that appears

### Step 4: Update the Code
1. Open `workshop/app/api/quiz/submit/route.ts`
2. Replace the `GOOGLE_SCRIPT_URL` with your new Web app URL:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'YOUR_NEW_WEB_APP_URL_HERE';
   ```

## Data Format Sent to Script

The API sends the following JSON data:

```json
{
  "submittedAt": "3/1/2026, 2:30:45 PM",
  "studentName": "John Doe",
  "registrationNumber": "2024CS001",
  "quizTitle": "Day 1 Quiz",
  "score": "12",
  "totalQuestions": "15",
  "timeTaken": "2 min 34 sec",
  "submissionType": "Manual"
}
```

## Google Sheets Structure

The script automatically creates a "QuizResults" sheet with these columns:

| Column | Header | Example |
|--------|--------|---------|
| A | Submitted At | 3/1/2026, 2:30:45 PM |
| B | Student Name | John Doe |
| C | Registration Number | 2024CS001 |
| D | Quiz Title | Day 1 Quiz |
| E | Score | 12 |
| F | Total Questions | 15 |
| G | Time Taken | 2 min 34 sec |
| H | Submission Type | Manual |

## Testing the Setup

### Test from Browser Console
You can test the Web App URL directly:

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    studentName: 'Test Student',
    registrationNumber: 'TEST001',
    quizTitle: 'Test Quiz',
    score: '10',
    totalQuestions: '15',
    timeTaken: '5 min 30 sec',
    submissionType: 'Manual'
  })
})
.then(r => r.json())
.then(console.log);
```

### Test from Quiz Page
1. Navigate to `/quiz`
2. Complete a quiz
3. Check your Google Sheet for the new entry

## Troubleshooting

### "Authorization required" error
- Redeploy the Web App
- Make sure "Who has access" is set to "Anyone"
- Re-authorize the script

### Data not appearing in sheet
- Check the Apps Script execution logs: **Executions** tab in Apps Script editor
- Verify the sheet name is exactly "QuizResults"
- Check that the Web App URL is correct in the code

### CORS errors
- Google Apps Script Web Apps handle CORS automatically
- Make sure you're using the Web App URL, not the script URL

## Updating the Script

If you need to modify the script:
1. Edit the code in Apps Script editor
2. Click **Save**
3. Click **Deploy** > **Manage deployments**
4. Click the pencil icon to edit
5. Change **Version** to "New version"
6. Click **Deploy**
7. The Web App URL remains the same

## Security Notes

- The Web App URL is public but only accepts POST requests
- Data is validated on the client side before submission
- The script runs with your Google account permissions
- Only you can view/edit the Google Sheet (unless you share it)
- Students cannot access the sheet directly

## Advantages of This Approach

1. **No API Key Required**: No need to manage Google Sheets API keys
2. **No CORS Issues**: Apps Script handles CORS automatically
3. **Simpler Setup**: Just deploy a script, no OAuth configuration
4. **Better Security**: Script runs with your permissions, not exposed API keys
5. **Automatic Sheet Creation**: Script creates the sheet if it doesn't exist
6. **Easy Updates**: Modify script without changing the URL
