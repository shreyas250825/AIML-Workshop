# Google Apps Script Update Required

## Issue
The leaderboard is not displaying data because the Google Apps Script needs to be updated to handle the new data format.

## Current Problems
1. Name and Registration Number not showing in Google Sheets
2. Leaderboard not displaying any data
3. Time sorting not working correctly

## Required Google Apps Script Update

Replace your current Google Apps Script code with this updated version:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  // Append row with all fields including timeInSeconds for sorting
  sheet.appendRow([
    new Date(),
    data.name,
    data.regNo,
    data.quizTitle,
    Number(data.score),
    Number(data.totalQuestions),
    data.timeTaken,
    Number(data.timeInSeconds),
    data.submissionType
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Remove header row
  data.shift();
  
  // Sort by score (highest first), then by time in seconds (lowest first)
  data.sort((a, b) => {
    // a[4] = score, a[7] = timeInSeconds
    if (b[4] === a[4]) {
      return a[7] - b[7]; // lower time wins if score same
    }
    return b[4] - a[4]; // higher score wins
  });
  
  // Return all data (not just top 10)
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Google Sheet Column Structure

Your sheet should have these columns (in order):

| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | Timestamp | Date | Auto-generated timestamp |
| B | Name | String | Student name |
| C | Reg No | String | Registration number |
| D | Quiz Title | String | Name of the quiz |
| E | Score | Number | Score achieved |
| F | Total Questions | Number | Total questions in quiz |
| G | Time Taken | String | Formatted as "X min Y sec" |
| H | Time In Seconds | Number | Raw seconds for sorting |
| I | Submission Type | String | "Manual" or "Auto (Time Up)" |

## Steps to Update

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Replace the entire code with the updated version above
4. Click "Save" (disk icon)
5. Click "Deploy" > "Manage deployments"
6. Click the edit icon (pencil) on your existing deployment
7. Change "Version" to "New version"
8. Add description: "Fixed data handling and sorting"
9. Click "Deploy"
10. The URL will remain the same

## What Changed

1. **Added timeInSeconds field**: Now stores raw seconds (column H) for accurate sorting
2. **Fixed number conversion**: Ensures score and totalQuestions are stored as numbers
3. **Returns all data**: Changed from top 10 to all records (filtering happens in the app)
4. **Better sorting**: Uses timeInSeconds (column H) instead of trying to parse the formatted time string

## Testing

After updating:
1. Submit a new quiz result
2. Check your Google Sheet - you should see all 9 columns filled
3. Visit the leaderboard page - data should now display
4. Check browser console for any errors

## Current API Endpoints

- **Quiz Submission**: `https://script.google.com/macros/s/AKfycby7RWePhH2TyrdUXzq3AFVfwCYpLlnTpfsD2chErov4buxVKhTKarKcDk-gHNeJr2Y/exec`
- **Auth (Login/Signup)**: `https://script.google.com/macros/s/AKfycbyoTTYKBhWWAEV7QHUJgMvfkNwKhSWPnjXs2_KWSSdb9NknBkI_7oyL9LeDepmgtaN-/exec`

## Verification

After the update, test by:
1. Submitting a quiz with name and registration number
2. Checking the Google Sheet to verify all columns are populated
3. Visiting `/leaderboard` to see if data displays correctly
4. Checking browser console (F12) for any API errors
