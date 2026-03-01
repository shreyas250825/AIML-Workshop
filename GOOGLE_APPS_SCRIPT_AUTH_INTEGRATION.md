# Google Apps Script Authentication Integration

## Overview

The authentication system now uses your Google Apps Script to handle user signup and login, storing all data in Google Sheets ("Users Data Workshop").

## Configuration

**Google Apps Script URL**: `https://script.google.com/macros/s/AKfycbwtKXv3WosoYvmVKsl0l-hwr2BTO7faCECypR-JnSzaAwlqnlJ865b0zmACC49dHOeu/exec`

**Google Sheet Name**: "Users Data Workshop"
**Sheet Name**: "Users"

## Google Sheets Structure

The "Users" sheet should have these columns:

| Column | Header | Example |
|--------|--------|---------|
| A | Timestamp | 3/1/2026, 2:30:45 PM |
| B | Name | John Doe |
| C | USN | 2024CS001 |
| D | Email | john@example.com |
| E | Password | password123 |

## Files Modified

### 1. `workshop/lib/auth.ts` - Complete Rewrite
- Removed all localStorage user storage
- Removed Google Sheets API integration
- Added direct Google Apps Script integration
- Simplified to use your existing script

**Key Changes:**
- `signup()` - Calls your script with action="signup"
- `login()` - Calls your script with action="login"
- `getAllUsers()` - Calls your script with action="getUsers" (GET request)
- Removed: `updateProfile()`, `changePassword()`, `getStudentCount()`

## How It Works

### Signup Flow
```
1. User fills signup form
   ↓
2. Frontend validates input
   ↓
3. POST to Google Apps Script
   {
     action: "signup",
     name: "John Doe",
     usn: "2024CS001",
     email: "john@example.com",
     password: "password123"
   }
   ↓
4. Script checks if email exists
   ↓
5. Script appends row to Google Sheets
   ↓
6. Returns { status: "success" } or { status: "exists" }
   ↓
7. Frontend creates session and stores user
```

### Login Flow
```
1. User enters email and password
   ↓
2. POST to Google Apps Script
   {
     action: "login",
     email: "john@example.com",
     password: "password123"
   }
   ↓
3. Script searches Google Sheets for matching email/password
   ↓
4. Returns { status: "success", name: "...", usn: "..." }
   or { status: "invalid" }
   ↓
5. Frontend creates session and stores user
```

### Admin Dashboard - Get Users
```
1. Admin opens dashboard
   ↓
2. GET request to Google Apps Script
   ?action=getUsers
   ↓
3. Script reads all rows from "Users" sheet
   ↓
4. Returns array of user data
   [
     [timestamp, name, usn, email, password],
     [timestamp, name, usn, email, password],
     ...
   ]
   ↓
5. Frontend converts to User objects and displays
```

## Your Google Apps Script

Your script already handles all three actions:

### POST Requests
- `action: "signup"` → `handleSignup()`
- `action: "login"` → `handleLogin()`

### GET Requests
- `action: "getUsers"` → Returns all users from sheet

## Admin Dashboard Integration

The admin dashboard now fetches real user data from Google Sheets:

**Location**: `/admin/dashboard`

**Features:**
- Shows all registered students from Google Sheets
- Displays: Name, USN, Email, Registration Date
- Auto-refreshes every 30 seconds
- Search functionality
- Shows total student count

## Testing

### Test Signup
1. Go to `/signup`
2. Fill in the form
3. Submit
4. Check Google Sheets - new row should appear
5. Should be logged in automatically

### Test Login
1. Go to `/login`
2. Enter credentials from Google Sheets
3. Submit
4. Should be logged in

### Test Admin Dashboard
1. Login as admin (if you have admin credentials)
2. Go to `/admin/dashboard`
3. Should see all students from Google Sheets
4. Data should match what's in the sheet

## Session Management

- Sessions last 24 hours
- User data stored in localStorage
- Session validated on each page load
- Auto-logout when session expires

## Security Notes

- Passwords are stored in plain text in Google Sheets (your script)
- Consider hashing passwords in the future
- Google Apps Script URL is public but requires correct data format
- Session tokens stored in browser localStorage
- No server-side session management

## Troubleshooting

### "Network error" on signup/login
- Check Google Apps Script URL is correct
- Verify script is deployed as Web App
- Check "Who has access" is set to "Anyone"
- Test script URL directly in browser

### Admin dashboard shows no users
- Check Google Sheets has data in "Users" sheet
- Verify column order matches expected format
- Check browser console for errors
- Test GET request: `SCRIPT_URL?action=getUsers`

### Users can't login with correct credentials
- Verify email and password match exactly in Google Sheets
- Check for extra spaces in sheet data
- Verify script's `handleLogin()` function works
- Check browser console for errors

## Data Format

### Signup Request
```json
{
  "action": "signup",
  "name": "John Doe",
  "usn": "2024CS001",
  "email": "john@example.com",
  "password": "password123"
}
```

### Signup Response (Success)
```json
{
  "status": "success"
}
```

### Signup Response (Email Exists)
```json
{
  "status": "exists"
}
```

### Login Request
```json
{
  "action": "login",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login Response (Success)
```json
{
  "status": "success",
  "name": "John Doe",
  "usn": "2024CS001"
}
```

### Login Response (Invalid)
```json
{
  "status": "invalid"
}
```

### Get Users Response
```json
[
  ["3/1/2026, 2:30:45 PM", "John Doe", "2024CS001", "john@example.com", "password123"],
  ["3/1/2026, 3:15:20 PM", "Jane Smith", "2024CS002", "jane@example.com", "password456"]
]
```

## Future Enhancements (Optional)

- Add password hashing in Google Apps Script
- Add email verification
- Add password reset functionality
- Add user profile editing
- Add role-based access control
- Add audit logging
- Add rate limiting
- Add CAPTCHA for signup

## Important Notes

1. **No localStorage fallback** - All data comes from Google Sheets
2. **Admin credentials** - You need to manually add admin user to Google Sheets with role field
3. **Session only** - User data stored in browser session, not synced back to sheets
4. **Read-only after login** - User data not updated in sheets after initial signup
