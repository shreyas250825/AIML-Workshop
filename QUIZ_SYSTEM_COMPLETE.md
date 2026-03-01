# Quiz System Implementation - Complete

## Overview

The quiz system has been enhanced with authentication, timer, and Google Sheets integration as requested.

## Features Implemented

### 1. Student Information Collection
- Students must enter their full name before starting the quiz
- Students must enter their registration number
- Information is displayed throughout the quiz session
- Information is saved to Google Sheets with quiz results

### 2. Quiz Password Protection
- Quiz requires a password known only to the instructor
- Password: `AIWorkshop2024@SecureQuiz` (can be changed in code)
- Password is hashed for security
- Students cannot proceed without correct password
- Error message shown for incorrect password

### 3. 15-Minute Timer
- Countdown timer starts when quiz begins
- Timer displayed prominently at top of page
- Color-coded warnings:
  - Green: > 5 minutes remaining
  - Yellow: 1-5 minutes remaining  
  - Red: < 1 minute remaining
- Timer format: MM:SS

### 4. Auto-Submit on Time Up
- Quiz automatically submits when timer reaches 0
- Students cannot continue after time expires
- Marked as "Auto (Time Up)" in Google Sheets

### 5. Google Sheets Integration
- Quiz results automatically saved to "QuizResults" sheet
- Data includes:
  - Submission timestamp (IST timezone)
  - Student name
  - Registration number
  - Quiz title
  - Score (correct answers)
  - Total questions
  - Accuracy percentage
  - Time taken (MM:SS format)
  - Submission type (Manual or Auto)

### 6. Time Tracking
- Tracks exact time taken to complete quiz
- Calculates time from quiz start to submission
- Useful for measuring student performance and engagement

## Files Modified

1. **workshop/app/quiz/page.tsx**
   - Added student info form
   - Added password verification
   - Added 15-minute countdown timer
   - Added auto-submit on time up
   - Added Google Sheets submission
   - Added time tracking

2. **workshop/app/api/quiz/submit/route.ts** (NEW)
   - API endpoint for submitting quiz results
   - Formats data for Google Sheets
   - Handles timestamp conversion to IST
   - Calculates accuracy percentage

3. **workshop/GOOGLE_SHEETS_SETUP.md**
   - Updated with QuizResults sheet structure
   - Added column headers documentation

4. **workshop/QUIZ_PASSWORD_INFO.md** (NEW)
   - Documentation for quiz password
   - Instructions for changing password
   - Quiz flow explanation
   - Security features documentation

## Google Sheets Setup Required

### Create QuizResults Sheet

In your Google Sheet, create a new sheet named "QuizResults" with these headers:

| Column | Header |
|--------|--------|
| A | Submitted At |
| B | Student Name |
| C | Registration Number |
| D | Quiz Title |
| E | Score |
| F | Total Questions |
| G | Accuracy |
| H | Time Taken |
| I | Submission Type |

## Quiz Flow

```
1. Student clicks "Start Quiz" on quiz selection page
   ↓
2. Student enters name and registration number
   ↓
3. Student enters quiz password
   ↓
4. Timer starts (15 minutes)
   ↓
5. Student answers questions
   ↓
6. Either:
   - Student clicks "Submit Quiz" (Manual)
   - Timer reaches 0 (Auto-submit)
   ↓
7. Results validated server-side
   ↓
8. Results saved to Google Sheets
   ↓
9. Success screen shown with score
```

## Security Features

- **Password Hashing**: Quiz password is hashed, not stored in plain text
- **Server-Side Validation**: Answers validated on server, not client
- **Timer Enforcement**: Timer cannot be manipulated by students
- **Auto-Submit**: Ensures students cannot continue after time expires
- **Session-Based**: Requires login to access quiz

## Configuration

### Change Quiz Password

Edit `workshop/app/quiz/page.tsx` line 18:
```typescript
const QUIZ_PASSWORD_HASH = hashPassword('YourNewPasswordHere');
```

### Change Timer Duration

Edit `workshop/app/quiz/page.tsx` line 21:
```typescript
const QUIZ_DURATION = 20 * 60; // 20 minutes in seconds
```

### Environment Variables Required

In `.env.local`:
```
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id
NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key
GOOGLE_SHEETS_API_KEY=your_api_key
```

## Testing Checklist

- [ ] Student can enter name and registration number
- [ ] Quiz password validation works
- [ ] Timer starts at 15:00 and counts down
- [ ] Timer colors change appropriately
- [ ] Quiz auto-submits at 0:00
- [ ] Manual submit works before time expires
- [ ] Results appear in Google Sheets
- [ ] All data fields are correct in Google Sheets
- [ ] Time taken is calculated correctly
- [ ] Submission type is marked correctly

## Known Limitations

- Students can retake quizzes (each attempt is recorded)
- No prevention of multiple submissions from same student
- Timer continues if student refreshes page (new session starts)

## Future Enhancements (Optional)

- Track quiz attempts per student
- Prevent multiple submissions
- Add quiz analytics dashboard
- Export results to CSV
- Email results to students
- Add quiz scheduling (start/end dates)

## Support

For issues or questions:
1. Check QUIZ_PASSWORD_INFO.md for password and configuration
2. Check GOOGLE_SHEETS_SETUP.md for Google Sheets setup
3. Check browser console for error messages
4. Verify environment variables are set correctly
