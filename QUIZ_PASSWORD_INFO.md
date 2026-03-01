# Quiz Password Configuration

## Current Quiz Password

The current quiz password is: **AIWorkshop2024@SecureQuiz**

This password is hashed in the code for security.

## How to Change the Quiz Password

1. Open `workshop/app/quiz/page.tsx`
2. Find this line (around line 18):
   ```typescript
   const QUIZ_PASSWORD_HASH = hashPassword('AIWorkshop2024@SecureQuiz'); // Change this password
   ```
3. Replace `'AIWorkshop2024@SecureQuiz'` with your new password
4. Save the file
5. The password will be automatically hashed when the application runs

## Quiz Flow

1. **Student Information**: Students enter their name and registration number
2. **Quiz Password**: Students must enter the quiz password (only you know this)
3. **Quiz Timer**: 15-minute countdown timer starts automatically
4. **Auto-Submit**: Quiz automatically submits when timer reaches 0
5. **Manual Submit**: Students can submit before time runs out
6. **Google Sheets**: Results are automatically saved to Google Sheets

## Quiz Results in Google Sheets

The quiz results are saved to the "QuizResults" sheet with the following columns:

- **Submitted At**: Date and time of submission (IST timezone)
- **Student Name**: Full name entered by student
- **Registration Number**: Registration number entered by student
- **Quiz Title**: Name of the quiz (Day 1 or Day 2)
- **Score**: Number of correct answers
- **Total Questions**: Total number of questions in the quiz
- **Time Taken**: Time taken to complete (e.g., "2 min 34 sec")
- **Submission Type**: "Manual" or "Auto (Time Up)"

## Timer Configuration

The quiz timer is set to 15 minutes. To change this:

1. Open `workshop/app/quiz/page.tsx`
2. Find this line (around line 21):
   ```typescript
   const QUIZ_DURATION = 15 * 60; // 15 minutes in seconds
   ```
3. Change `15` to your desired duration in minutes
4. Save the file

## Security Features

- Quiz password is hashed using a simple hash function
- Password is never stored in plain text in the client code
- Students cannot inspect the correct answers in browser DevTools (server-side validation)
- Timer cannot be manipulated by students
- Auto-submit ensures students cannot continue after time expires

## Google Sheets Setup

Make sure you have:
1. Created a "QuizResults" sheet in your Google Sheet
2. Added the headers as specified in GOOGLE_SHEETS_SETUP.md
3. Configured your environment variables in `.env.local`

## Testing

To test the quiz system:
1. Navigate to `/quiz`
2. Select a quiz
3. Enter student information
4. Enter the quiz password: `AIWorkshop2024@SecureQuiz`
5. Complete the quiz
6. Check your Google Sheet for the results

## Notes

- Students must be logged in to access the quiz page
- Each quiz attempt is recorded separately in Google Sheets
- The timer shows different colors:
  - Green: More than 5 minutes remaining
  - Yellow: 1-5 minutes remaining
  - Red: Less than 1 minute remaining
