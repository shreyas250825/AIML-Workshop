# Google Sheets Authentication - Complete Setup

## Overview
The student login and signup system now integrates with Google Sheets for user management.

## Google Apps Script URL
```
https://script.google.com/macros/s/AKfycbyoTTYKBhWWAEV7QHUJgMvfkNwKhSWPnjXs2_KWSSdb9NknBkI_7oyL9LeDepmgtaN-/exec
```

## Google Sheet Structure
**Sheet Name:** Users

**Columns:**
1. Date - Timestamp of registration
2. Name - Student's full name
3. USN - University Seat Number
4. Email - Student's email address
5. Password - Student's password (stored as entered)

## API Routes

### Signup: `/api/auth/signup`
- **Method:** POST
- **Body:** `{ name, usn, email, password }`
- **Response:** 
  - Success: `{ success: true, message: "Registration successful" }`
  - Email exists: `{ success: false, error: "Email already registered" }`
  - Error: `{ success: false, error: "Registration failed" }`

### Login: `/api/auth/login`
- **Method:** POST
- **Body:** `{ email, password }`
- **Response:**
  - Success: `{ success: true, user: { name, email, usn, role: "student" } }`
  - Invalid: `{ success: false, error: "Invalid email or password" }`
  - Error: `{ success: false, error: "Login failed" }`

## User Flow

### Signup Flow
1. User fills signup form (name, USN, email, password)
2. Frontend validates input
3. POST request to `/api/auth/signup`
4. API route sends data to Google Apps Script
5. Google Apps Script checks if email exists
6. If new email, appends row to Users sheet
7. On success, auto-login by calling `/api/auth/login`
8. User data stored in localStorage
9. Redirect to dashboard

### Login Flow
1. User enters email and password
2. POST request to `/api/auth/login`
3. API route sends credentials to Google Apps Script
4. Google Apps Script validates against Users sheet
5. On success, returns user data (name, usn)
6. User data stored in localStorage
7. AuthContext updated
8. Redirect to dashboard

## Local Storage
After successful login, user data is stored:
```javascript
localStorage.setItem('user', JSON.stringify({
  name: "Student Name",
  email: "student@email.com",
  usn: "1XX21CS001",
  role: "student"
}));
```

## Files Modified
- `workshop/app/login/page.tsx` - Updated to use `/api/auth/login`
- `workshop/app/signup/page.tsx` - Updated to use `/api/auth/signup`
- `workshop/app/api/auth/login/route.ts` - Created API route
- `workshop/app/api/auth/signup/route.ts` - Created API route

## Testing
1. Go to `/signup` and create a new account
2. Check Google Sheet to verify data was added
3. Go to `/login` and login with the credentials
4. Verify redirect to `/dashboard`
5. Check localStorage for user data

## Notes
- Passwords are stored in plain text in Google Sheets (consider hashing in production)
- Student count feature removed (no longer limiting registrations)
- Auto-login after signup for better UX
- All authentication now goes through Google Sheets
