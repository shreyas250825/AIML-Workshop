# CORS Error Fix Guide - Google Apps Script

## The Problem

You're seeing this error:
```
Signup error: TypeError: Failed to fetch
Login error: TypeError: Failed to fetch
```

This is a **CORS (Cross-Origin Resource Sharing)** issue with your Google Apps Script.

## Why This Happens

When your Next.js app (running on `localhost:3000`) tries to call your Google Apps Script URL, the browser blocks it because:
1. Google Apps Script needs to be properly deployed
2. The script needs to allow requests from any origin
3. The script needs to handle CORS headers

## Solution: Update Your Google Apps Script

You need to add CORS headers to your Google Apps Script. Here's the updated code:

### Updated Google Apps Script Code

```javascript
// ---------------- CORS HELPER ----------------
function addCorsHeaders(output) {
  return output
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ---------------- HANDLE OPTIONS (CORS PREFLIGHT) ----------------
function doOptions(e) {
  return addCorsHeaders(
    ContentService.createTextOutput('')
  );
}

// ---------------- POST HANDLER ----------------
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  let result;
  if (action === "signup") {
    result = handleSignup(data);
  } else if (action === "login") {
    result = handleLogin(data);
  } else {
    result = jsonResponse({ status: "invalid_action" });
  }
  
  return addCorsHeaders(result);
}

// ---------------- GET HANDLER ----------------
function doGet(e) {
  const action = e.parameter.action;
  
  let result;
  if (action === "checkAuth") {
    result = jsonResponse({ status: "ok" });
  } else if (action === "getUsers") {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
    const data = sheet.getDataRange().getValues();
    data.shift(); // remove header
    result = jsonResponse(data);
  } else {
    result = jsonResponse({ status: "invalid_request" });
  }
  
  return addCorsHeaders(result);
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
  
  // Append new user (only 5 columns: timestamp, name, usn, email, password)
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

## Key Changes Made

1. **Added `addCorsHeaders()` function** - Adds CORS headers to all responses
2. **Added `doOptions()` function** - Handles CORS preflight requests
3. **Updated `doPost()` and `doGet()`** - Now wrap responses with CORS headers
4. **Removed confirm password column** - Only stores 5 columns now

## How to Update Your Script

1. Go to your Google Apps Script: https://script.google.com
2. Open your "Users Data Workshop" script
3. Replace ALL the code with the code above
4. Click **Save** (disk icon)
5. Click **Deploy** → **Manage deployments**
6. Click the **Edit** icon (pencil) on your existing deployment
7. Change **Version** to "New version"
8. Click **Deploy**
9. Copy the new Web App URL (it should be the same)

## Verify Deployment Settings

Make sure your deployment has these settings:
- **Execute as**: Me (your email)
- **Who has access**: Anyone

## Test the Script

After updating, test it directly in your browser:

### Test GET request:
```
https://script.google.com/macros/s/AKfycbwtKXv3WosoYvmVKsl0l-hwr2BTO7faCECypR-JnSzaAwlqnlJ865b0zmACC49dHOeu/exec?action=getUsers
```

You should see JSON data with your users.

### Test POST request:
Use a tool like Postman or curl:
```bash
curl -X POST \
  https://script.google.com/macros/s/AKfycbwtKXv3WosoYvmVKsl0l-hwr2BTO7faCECypR-JnSzaAwlqnlJ865b0zmACC49dHOeu/exec \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"test@example.com","password":"test123"}'
```

## After Updating

1. Clear your browser cache
2. Restart your Next.js dev server
3. Try signing up again
4. Check browser console for any new errors

## Still Not Working?

If you still see "Failed to fetch" errors:

### Check 1: Script Deployment
- Make sure you deployed as "New version"
- Verify "Who has access" is set to "Anyone"

### Check 2: Browser Console
- Open browser DevTools (F12)
- Go to Network tab
- Try signup/login
- Click on the failed request
- Check the response - what error does it show?

### Check 3: Script Logs
- In Google Apps Script, go to **Executions**
- Check if your script is being called
- Look for any error messages

### Check 4: Test with Simple HTML
Create a test HTML file to verify the script works:

```html
<!DOCTYPE html>
<html>
<body>
  <button onclick="testSignup()">Test Signup</button>
  <button onclick="testLogin()">Test Login</button>
  <div id="result"></div>

  <script>
    const SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';

    async function testSignup() {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name: 'Test User',
          usn: 'TEST001',
          email: 'test@example.com',
          password: 'test123'
        })
      });
      const data = await response.json();
      document.getElementById('result').innerText = JSON.stringify(data);
    }

    async function testLogin() {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: 'test@example.com',
          password: 'test123'
        })
      });
      const data = await response.json();
      document.getElementById('result').innerText = JSON.stringify(data);
    }
  </script>
</body>
</html>
```

## Common Issues

### Issue: "Script function not found: doOptions"
**Solution**: Make sure you added the `doOptions()` function to your script

### Issue: "Authorization required"
**Solution**: Redeploy the script and make sure "Execute as: Me" is selected

### Issue: Still getting CORS errors
**Solution**: 
1. Make sure you saved the script
2. Make sure you deployed a NEW version
3. Clear browser cache
4. Try in incognito mode

## Need More Help?

Share the following information:
1. The exact error message from browser console
2. The Network tab response from DevTools
3. Any errors from Google Apps Script Executions log
