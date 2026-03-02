# Passwords Page - Google Sheets Integration Complete ✅

## Setup Status

✅ Google Apps Script deployed  
✅ Environment variable configured  
✅ Passwords page created with integration  
✅ API route configured  

## Google Apps Script URL

```
https://script.google.com/macros/s/AKfycbwUuz_4IGwEZs1x0ZbZvVoqIT1k92IpNI6n_KsqvRrcNqHmOyOjdtgk1M2tQ6xqtPzPGQ/exec
```

## How to Use

### 1. Add Passwords to Google Sheets

1. Open your Google Sheet named "AI Workshop Passwords"
2. Go to the "Passwords" sheet
3. Add passwords in this format:

| caseStudyName | stepName | password | timestamp |
|---------------|----------|----------|-----------|
| House Price Prediction | Step 1: Import Libraries | hP9x2Lm4 | (auto-filled) |
| Credit Risk Classification | Step 2: Load Data | cR5k8Nx2 | (auto-filled) |

### 2. View Passwords on Website

1. Visit `/passwords` page (no login required)
2. Passwords from Google Sheets will appear automatically
3. Page auto-refreshes every 5 seconds

### 3. Add Local Passwords (Optional)

1. Click "Add Password" button
2. Enter passcode: `workshop34`
3. Fill in the form
4. Password is saved locally (not synced to Google Sheets)

### 4. Delete Local Passwords

1. Click "Delete" button on any local password
2. Enter passcode: `workshop34`
3. Password is removed from localStorage

Note: Google Sheets passwords cannot be deleted from the web interface - only from the sheet itself.

## Features

✅ **Public Access** - Anyone can view passwords without login  
✅ **Google Sheets Integration** - Fetches passwords from your sheet  
✅ **Auto-Refresh** - Updates every 5 seconds  
✅ **Dual Source** - Shows both Google Sheets and local passwords  
✅ **Source Badges** - Green for Google Sheets, Blue for Local  
✅ **Passcode Protection** - Only authorized users can add/delete local passwords  
✅ **Copy to Clipboard** - One-click copy for any password  

## Testing

1. Add a test password to your Google Sheet
2. Visit `http://localhost:3000/passwords`
3. You should see the password appear within 5 seconds
4. Try copying the password
5. Try adding a local password with passcode `workshop34`

## Deployment

When deploying to Vercel, add the environment variable:

```
NEXT_PUBLIC_PASSWORDS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwUuz_4IGwEZs1x0ZbZvVoqIT1k92IpNI6n_KsqvRrcNqHmOyOjdtgk1M2tQ6xqtPzPGQ/exec
```

## Troubleshooting

**Passwords not showing:**
- Check if the Google Sheet has the correct data
- Verify the sheet name is exactly "Passwords"
- Check browser console for errors
- Verify the Apps Script is deployed with "Anyone" access

**CORS errors:**
- Redeploy the Apps Script as a Web App
- Ensure "Who has access" is set to "Anyone"

**Passwords not updating:**
- Wait 5 seconds for auto-refresh
- Try manually refreshing the page
- Check if the Google Sheet has new data
