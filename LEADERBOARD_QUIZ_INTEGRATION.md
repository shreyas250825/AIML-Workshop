# Leaderboard Quiz Integration

## Overview

The leaderboard now displays real-time quiz rankings fetched from Google Sheets via Google Apps Script. Students are ranked by score (highest first) and time taken (fastest first for ties).

## Features Implemented

### 1. Dual Tab System
- **Quiz Rankings Tab**: Shows quiz leaderboard with scores and times
- **Registrations Tab**: Shows all registered students (original view)

### 2. Quiz Leaderboard Ranking Logic
Students are ranked using this priority:
1. **Higher Score** = Better rank
2. **Faster Time** = Better rank (for same scores)

Example:
- Student A: 14/15, 3 min 20 sec → Rank 1
- Student B: 14/15, 4 min 10 sec → Rank 2
- Student C: 13/15, 2 min 30 sec → Rank 3

### 3. Best Attempt Selection
- If a student takes the quiz multiple times, only their best attempt is shown
- "Best" = highest score, or if scores are equal, fastest time

### 4. Real-Time Updates
- Leaderboard auto-refreshes every 30 seconds
- Manual refresh available by switching tabs

### 5. Visual Indicators
- 🥇 Gold medal for 1st place
- 🥈 Silver medal for 2nd place
- 🥉 Bronze medal for 3rd place
- Purple badges for other ranks

## Files Created/Modified

### 1. API Route: `workshop/app/api/quiz/leaderboard/route.ts` (NEW)
- Fetches quiz data from Google Apps Script
- Groups results by student (keeps best attempt)
- Sorts by score (desc) then time (asc)
- Returns ranked leaderboard

### 2. Leaderboard Page: `workshop/app/leaderboard/page.tsx`
- Added tab switcher (Quiz Rankings / Registrations)
- Added quiz leaderboard table
- Added loading states
- Added search functionality for both tabs
- Auto-refresh every 30 seconds

### 3. Google Apps Script: Updated with GET handler
- Added `doGet()` function to return all quiz results
- Returns data as JSON array
- Handles empty sheet gracefully

## Google Apps Script Requirements

Your Google Apps Script must handle both POST and GET requests:

### POST Request (Submit Quiz)
```javascript
function doPost(e) {
  // Saves quiz result to sheet
  // Already implemented
}
```

### GET Request (Fetch Leaderboard) - NEW
```javascript
function doGet(e) {
  // Returns all quiz results as JSON
  // See GOOGLE_APPS_SCRIPT_SETUP.md for full code
}
```

## Leaderboard Display Columns

| Column | Description | Example |
|--------|-------------|---------|
| Rank | Position with medal icons | 🥇 or 1 |
| Student | Name with avatar | John Doe |
| Reg No | Registration number | 2024CS001 |
| Score | Correct/Total | 14 / 15 |
| Time Taken | Completion time | 3 min 20 sec |
| Quiz | Quiz name | Day 1 Quiz |

## Data Flow

```
Quiz Submission
    ↓
Google Apps Script (POST)
    ↓
Google Sheets (QuizResults)
    ↓
Google Apps Script (GET)
    ↓
/api/quiz/leaderboard
    ↓
Leaderboard Page
```

## Ranking Algorithm

```typescript
// 1. Group by student (keep best attempt)
const studentBest = new Map();
data.forEach(entry => {
  const existing = studentBest.get(studentKey);
  if (!existing || 
      entry.score > existing.score || 
      (entry.score === existing.score && entry.time < existing.time)) {
    studentBest.set(studentKey, entry);
  }
});

// 2. Sort by score (desc) then time (asc)
leaderboard.sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  return a.timeInSeconds - b.timeInSeconds;
});

// 3. Assign ranks
leaderboard.map((entry, index) => ({
  ...entry,
  rank: index + 1
}));
```

## Time Parsing

Time strings like "3 min 20 sec" are converted to seconds for sorting:
```typescript
const parseTime = (timeStr: string): number => {
  const match = timeStr.match(/(\d+)\s*min\s*(\d+)\s*sec/);
  if (!match) return 999999; // Invalid time goes to bottom
  return parseInt(match[1]) * 60 + parseInt(match[2]);
};
```

## Testing

### Test Quiz Submission
1. Complete a quiz
2. Check Google Sheets for new entry
3. Navigate to Leaderboard → Quiz Rankings tab
4. Verify your entry appears with correct rank

### Test Ranking Logic
1. Have multiple students complete quizzes with different scores
2. Verify higher scores rank higher
3. Have students with same score complete at different times
4. Verify faster time ranks higher for same score

### Test Multiple Attempts
1. Complete a quiz with low score
2. Complete same quiz again with higher score
3. Verify only best attempt shows on leaderboard

### Test Auto-Refresh
1. Open leaderboard
2. Have another student complete quiz
3. Wait 30 seconds
4. Verify new entry appears automatically

## Troubleshooting

### Leaderboard shows "No quiz results yet"
- Check Google Sheets has data in QuizResults sheet
- Verify Google Apps Script has `doGet()` function
- Check browser console for API errors
- Test the script URL directly in browser

### Rankings are incorrect
- Verify time format in Google Sheets is "X min Y sec"
- Check score values are numbers, not text
- Verify sorting logic in API route

### Data not updating
- Check auto-refresh is working (30 second interval)
- Manually refresh by switching tabs
- Check browser console for errors
- Verify Google Apps Script is deployed correctly

### Students appear multiple times
- Check the grouping logic in API route
- Verify student name and registration number match exactly
- Check for extra spaces in names

## Future Enhancements (Optional)

- Filter by quiz (Day 1 vs Day 2)
- Show all attempts per student (expandable rows)
- Export leaderboard to CSV
- Add percentile rankings
- Show improvement over time
- Add quiz completion badges
- Display average time per question
- Show quiz difficulty metrics

## Security Notes

- Leaderboard data is public (visible to all logged-in users)
- Google Apps Script URL is public but read-only for GET requests
- No sensitive data is exposed (only names, scores, times)
- Students cannot modify leaderboard data
- Only quiz submission can write to Google Sheets

## Performance

- API caches are not implemented (always fetches fresh data)
- Auto-refresh every 30 seconds (configurable)
- Leaderboard processes all quiz results on each request
- For large datasets (1000+ entries), consider server-side caching
