# Auth and Leaderboard Fixes - Complete

## Issues Fixed

### 1. Auth API 404 Errors ✅
**Problem**: Login and signup pages were getting 404 errors when calling `/api/auth/login` and `/api/auth/signup`

**Solution**: Updated both API routes to properly integrate with Google Apps Script instead of returning stub responses.

**Files Modified**:
- `workshop/app/api/auth/login/route.ts` - Now calls Google Apps Script for authentication
- `workshop/app/api/auth/signup/route.ts` - Now calls Google Apps Script for registration

**Google Apps Script URL**: `https://script.google.com/macros/s/AKfycbyoTTYKBhWWAEV7QHUJgMvfkNwKhSWPnjXs2_KWSSdb9NknBkI_7oyL9LeDepmgtaN-/exec`

### 2. Leaderboard Not Showing Data ✅
**Problem**: Quiz results were being saved to Google Sheets but not appearing in the leaderboard

**Root Causes**:
1. Google Apps Script was trying to sort by time as a number, but receiving a string ("2 min 34 sec")
2. Column structure mismatch between what was sent and what was expected

**Solution**: 
1. Updated quiz submission to send `timeInSeconds` (raw number) in addition to formatted time
2. Updated leaderboard API to read from correct column indices
3. Created documentation for updating Google Apps Script

**Files Modified**:
- `workshop/app/api/quiz/submit/route.ts` - Now sends `timeInSeconds` field
- `workshop/app/api/quiz/leaderboard/route.ts` - Updated to read timeInSeconds from column 7
- `workshop/GOOGLE_APPS_SCRIPT_UPDATE_NEEDED.md` - Complete guide for updating Google Apps Script

## Data Flow

### Quiz Submission Flow
1. Student completes quiz with name and registration number
2. Quiz page sends data to `/api/quiz/submit`:
   ```json
   {
     "studentName": "John Doe",
     "registrationNumber": "1XX21CS001",
     "quizTitle": "Day 1 Quiz",
     "score": 12,
     "totalQuestions": 15,
     "timeTaken": 450,
     "isAutoSubmit": false
   }
   ```
3. API formats and sends to Google Apps Script:
   ```json
   {
     "name": "John Doe",
     "regNo": "1XX21CS001",
     "quizTitle": "Day 1 Quiz",
     "score": 12,
     "totalQuestions": 15,
     "timeTaken": "7 min 30 sec",
     "timeInSeconds": 450,
     "submissionType": "Manual"
   }
   ```
4. Google Apps Script appends to sheet with 9 columns

### Leaderboard Display Flow
1. Leaderboard page calls `/api/quiz/leaderboard`
2. API fetches data from Google Apps Script `doGet` endpoint
3. Receives array of arrays (each row from sheet)
4. Groups by registration number
5. Calculates best score and fastest time per student
6. Sorts by score (highest first), then time (fastest first)
7. Returns formatted leaderboard data
8. Frontend displays with medals for top 2

## Google Sheet Structure

After updating Google Apps Script, your sheet will have these columns:

| Column | Field | Example |
|--------|-------|---------|
| A | Timestamp | 3/1/2026 10:30:00 |
| B | Name | John Doe |
| C | Reg No | 1XX21CS001 |
| D | Quiz Title | Day 1 Quiz |
| E | Score | 12 |
| F | Total Questions | 15 |
| G | Time Taken | 7 min 30 sec |
| H | Time In Seconds | 450 |
| I | Submission Type | Manual |

## Next Steps

### REQUIRED: Update Google Apps Script
You MUST update your Google Apps Script code to handle the new data format. See `GOOGLE_APPS_SCRIPT_UPDATE_NEEDED.md` for:
- Complete updated code
- Step-by-step deployment instructions
- Testing procedures

### Testing Checklist
After updating Google Apps Script:

1. **Test Auth**:
   - [ ] Go to `/signup` and create a test account
   - [ ] Check Google Sheet "Users" tab for new row
   - [ ] Go to `/login` and login with test credentials
   - [ ] Verify redirect to `/dashboard`
   - [ ] Check browser console - no 404 errors

2. **Test Quiz Submission**:
   - [ ] Go to `/quiz`
   - [ ] Enter name and registration number
   - [ ] Enter quiz password
   - [ ] Complete quiz
   - [ ] Check Google Sheet "QuizResults" tab
   - [ ] Verify all 9 columns are filled

3. **Test Leaderboard**:
   - [ ] Go to `/leaderboard`
   - [ ] Verify data displays
   - [ ] Check top 2 have medals (gold and silver)
   - [ ] Verify sorting (highest score first, then fastest time)
   - [ ] Check browser console for any errors

## API Endpoints Summary

### Auth System
- **Login**: POST `/api/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ success, user: { name, email, usn, role } }`
  
- **Signup**: POST `/api/auth/signup`
  - Body: `{ name, usn, email, password }`
  - Returns: `{ success, message }`

### Quiz System
- **Submit**: POST `/api/quiz/submit`
  - Body: `{ studentName, registrationNumber, quizTitle, score, totalQuestions, timeTaken, isAutoSubmit }`
  - Returns: `{ success, data }`

- **Leaderboard**: GET `/api/quiz/leaderboard`
  - Returns: `{ success, data: [{ rank, studentName, registrationNumber, bestScore, totalQuestions, fastestTime, quizzesTaken }] }`

## Troubleshooting

### Auth still showing 404
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check that Google Apps Script is deployed and URL is correct
- Verify Google Apps Script has `doPost` function with `action` parameter handling

### Leaderboard still empty
- Update Google Apps Script code (see GOOGLE_APPS_SCRIPT_UPDATE_NEEDED.md)
- Submit a new quiz result after updating
- Check browser console for API errors
- Verify Google Sheet has data in all 9 columns

### Data not saving to Google Sheets
- Check Google Apps Script execution logs
- Verify deployment is set to "Anyone" access
- Test the Google Apps Script URL directly in browser
- Check that sheet names match exactly ("Users" and "QuizResults")

## Files Changed in This Fix

1. `workshop/app/api/auth/login/route.ts` - Google Sheets integration
2. `workshop/app/api/auth/signup/route.ts` - Google Sheets integration
3. `workshop/app/api/quiz/submit/route.ts` - Added timeInSeconds field
4. `workshop/app/api/quiz/leaderboard/route.ts` - Updated column indices
5. `workshop/GOOGLE_APPS_SCRIPT_UPDATE_NEEDED.md` - New documentation
6. `workshop/AUTH_AND_LEADERBOARD_FIXES.md` - This file

## Status
✅ Code changes complete
⚠️ Requires Google Apps Script update (see GOOGLE_APPS_SCRIPT_UPDATE_NEEDED.md)
