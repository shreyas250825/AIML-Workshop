# Google Apps Script for Authentication

## Complete Script Code

Add this to your Google Apps Script editor:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  if (action === "signup") {
    return handleSignup(data);
  }
  
  if (action === "login") {
    return handleLogin(data);
  }
}

function doGet(e) {
  // Return all users from the Users sheet (for admin dashboard)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  const data = sheet.getDataRange().getValues();
  
  // Remove header row
  data.shift();
  
  // Return the data as JSON
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------- SIGNUP ----------------
function handleSignup(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  const users = sheet.getDataRange().getValues();
  
  // Check if email already exists
  for (let i = 1; i < users.length; i++) {
    if (users[i][3] === data.email) {
      return jsonResponse({ status: "exists" });
    }
  }
  
  // Add new user
  sheet.appendRow([
    new Date(),
    data.name,
    data.usn,
    data.email,
    data.password
  ]);
  
  return jsonResponse({ status: "success" });
}

// ---------------- LOGIN ----------------
function handleLogin(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  const users = sheet.getDataRange().getValues();
  
  // Check credentials
  for (let i = 1; i < users.length; i++) {
    if (users[i][3] === data.email && users[i][4] === data.password) {
      return jsonResponse({
        status: "success",
        name: users[i][1],
        usn: users[i][2]
      });
    }
  }
  
  return jsonResponse({ status: "invalid" });
}

// ---------------- HELPER ----------------
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Sheet Structure

**Sheet Name:** Users

**Header Row (Row 1):**
- Date | Name | USN | Email | Password

**Columns:**
1. Date (Column A) - Timestamp
2. Name (Column B) - Full name
3. USN (Column C) - University Seat Number
4. Email (Column D) - Email address
5. Password (Column E) - Password

## API Endpoints

### POST - Signup/Login
- **Action: signup** - Register new user
- **Action: login** - Authenticate user

### GET - List Users
- Returns all users from the Users sheet (excluding header row)
- Format: Array of arrays `[[date, name, usn, email, password], ...]`
- Used by admin dashboard to display registered students

## Deployment

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Paste the complete script code
4. Click "Deploy" > "New deployment"
5. Select type: "Web app"
6. Execute as: "Me"
7. Who has access: "Anyone"
8. Click "Deploy"
9. Copy the web app URL
10. Update the URL in your Next.js app:
    - `workshop/app/api/auth/login/route.ts`
    - `workshop/app/api/auth/signup/route.ts`
    - `workshop/app/api/users/list/route.ts`

## Testing

### Test Signup
```bash
curl -X POST "YOUR_SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"signup","name":"Test User","usn":"1XX21CS001","email":"test@example.com","password":"test123"}'
```

### Test Login
```bash
curl -X POST "YOUR_SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"test@example.com","password":"test123"}'
```

### Test Get Users (Admin Dashboard)
```bash
curl "YOUR_SCRIPT_URL"
```

## Features

### Student Features
- Signup with name, USN, email, password
- Login with email and password
- Auto-login after successful signup
- Session management via localStorage

### Admin Features
- View all registered students in dashboard
- Real-time statistics (total students, recent registrations)
- Search users by name, email, or USN
- Auto-refresh every 10 seconds
- Manual refresh button
- Displays: Name, USN, Email, Registration date

## Security Notes
- Passwords are stored in plain text in Google Sheets
- For production, consider implementing password hashing
- The Google Apps Script URL should be kept secure
- Consider adding rate limiting for production use
