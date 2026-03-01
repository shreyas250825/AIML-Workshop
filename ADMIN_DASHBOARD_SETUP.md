# Admin Dashboard - Google Sheets Setup

## Error: "<!DOCTYPE..." is not valid JSON

This error means the Google Apps Script is returning HTML instead of JSON. This happens when the `doGet()` function is missing or the script hasn't been redeployed.

## Quick Fix Steps

### Step 1: Open Your Google Apps Script

1. Open your Google Sheet with the "Users" sheet
2. Go to **Extensions** > **Apps Script**
3. You should see your existing code with `doPost()`, `handleSignup()`, and `handleLogin()` functions

### Step 2: Add the doGet() Function

Add this function to your script (at the top, right after `doPost()`):

```javascript
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
```

### Step 3: Redeploy the Script

**IMPORTANT:** You must redeploy after adding the function!

1. Click **Deploy** > **Manage deployments**
2. Click the **Edit** icon (pencil) next to your active deployment
3. Under "Version", select **New version**
4. Add a description like "Added doGet for admin dashboard"
5. Click **Deploy**
6. The URL should remain the same

### Step 4: Test the Setup

Open this URL in your browser (replace with your actual URL):
```
https://script.google.com/macros/s/AKfycbyoTTYKBhWWAEV7QHUJgMvfkNwKhSWPnjXs2_KWSSdb9NknBkI_7oyL9LeDepmgtaN-/exec
```

You should see JSON output like:
```json
[
  ["2024-03-01T10:30:00.000Z", "John Doe", "1XX21CS001", "john@example.com", "password123"],
  ["2024-03-01T11:15:00.000Z", "Jane Smith", "1XX21CS002", "jane@example.com", "password456"]
]
```

If you see HTML or a Google login page, the script isn't deployed correctly.

## Complete Google Apps Script Code

Here's the complete script with all functions:

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

## Troubleshooting

### Still seeing HTML?
- Make sure you clicked "New version" when redeploying
- Try using an incognito/private browser window
- Clear your browser cache
- Wait 1-2 minutes after deployment

### Empty array returned?
- Check that your "Users" sheet has data
- Make sure the sheet name is exactly "Users" (case-sensitive)
- Verify the header row exists (Date, Name, USN, Email, Password)

### Permission errors?
- In deployment settings, ensure "Execute as" is set to "Me"
- Ensure "Who has access" is set to "Anyone"

## After Setup

Once configured correctly:
- Admin dashboard will show all registered students
- Auto-refreshes every 10 seconds
- Search by name, email, or USN
- Shows registration statistics
