# Test Passwords API

## Google Apps Script URL
```
https://script.google.com/macros/s/AKfycbwUuz_4IGwEZs1x0ZbZvVoqIT1k92IpNI6n_KsqvRrcNqHmOyOjdtgk1M2tQ6xqtPzPGQ/exec
```

## Current Error
```
{ success: false, error: 'Passwords sheet not found' }
```

## How to Fix

### Step 1: Verify Sheet Name
1. Open your Google Sheet
2. Look at the sheet tab at the bottom
3. Make sure it's named EXACTLY: `Passwords` (capital P, no spaces before/after)
4. If it's named something else, right-click the tab → Rename → type `Passwords`

### Step 2: Verify Google Apps Script Location
1. In your Google Sheet, go to **Extensions → Apps Script**
2. Check that you're in the CORRECT spreadsheet (look at the title at the top)
3. The script should be in the SAME spreadsheet that has the "Passwords" sheet

### Step 3: Update the Google Apps Script Code
Copy this code and paste it into your Apps Script editor:

```javascript
function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Spreadsheet name:', spreadsheet.getName());
    
    const sheet = spreadsheet.getSheetByName('Passwords');
    
    if (!sheet) {
      // List all available sheets for debugging
      const allSheets = spreadsheet.getSheets().map(s => s.getName());
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Passwords sheet not found',
        availableSheets: allSheets,
        spreadsheetName: spreadsheet.getName()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const passwords = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(row => row.caseStudyName);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: passwords
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 4: Redeploy
1. Click **Deploy → Manage deployments**
2. Click the pencil icon (Edit)
3. Change version to "New version"
4. Click **Deploy**
5. Copy the new URL (should be the same)

### Step 5: Test the URL
Open this URL in your browser:
```
https://script.google.com/macros/s/AKfycbwUuz_4IGwEZs1x0ZbZvVoqIT1k92IpNI6n_KsqvRrcNqHmOyOjdtgk1M2tQ6xqtPzPGQ/exec
```

You should see either:
- SUCCESS: `{"success":true,"data":[...]}`
- ERROR with available sheets: `{"success":false,"error":"...","availableSheets":["Sheet1","Passwords"]}`

### Step 6: Check Your Sheet Structure
Make sure your "Passwords" sheet has these EXACT column headers in row 1:
- Column A: `caseStudyName`
- Column B: `stepName`
- Column C: `password`
- Column D: `timestamp`

Example data:
| caseStudyName | stepName | password | timestamp |
|---------------|----------|----------|-----------|
| House Prediction | Step 1 | hP9oZLm4 | 10:00 |
| House Prediction | Step 2 | dS7bR3hQ | 10:00 |

## After Fixing
1. Restart your Next.js dev server
2. Refresh the passwords page
3. Passwords should appear within 5 seconds!
