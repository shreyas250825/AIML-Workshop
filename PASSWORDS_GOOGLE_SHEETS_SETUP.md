# Password Management with Google Sheets Integration

## Setup Instructions

### 1. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "AI Workshop Passwords"
4. Create a sheet named **"Passwords"** (exact name)
5. Add headers in the first row:
   - Column A: `caseStudyName`
   - Column B: `stepName`
   - Column C: `password`
   - Column D: `timestamp`

### 2. Deploy Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Copy the code from `GOOGLE_APPS_SCRIPT_PASSWORDS.js`
4. Paste it into the Apps Script editor
5. Click **Deploy > New deployment**
6. Choose **Web app**
7. Settings:
   - Description: "Password Management API"
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy**
9. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/...../exec`)

### 3. Configure Environment Variable

Add the Google Apps Script URL to your `.env.local` file:

```env
NEXT_PUBLIC_PASSWORDS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with your actual script URL.

### 4. Test the Integration

1. Add a test password directly in Google Sheets:
   - caseStudyName: "House Price Prediction"
   - stepName: "Step 1: Import Libraries"
   - password: "test123"
   - timestamp: (leave empty, will auto-fill)

2. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

3. Visit `/passwords` page
4. You should see the password from Google Sheets

### 5. How It Works

**Viewing Passwords:**
- Anyone can visit `/passwords` page (no login required)
- Passwords are fetched from Google Sheets every 5 seconds
- Both Google Sheets passwords AND locally added passwords are shown

**Adding Passwords:**
- Click "Add Password" button
- Enter passcode: `workshop34`
- Fill in the form
- Password is saved to localStorage (local only, not synced to Google Sheets)

**Deleting Passwords:**
- Click "Delete" button on any password
- Enter passcode: `workshop34`
- Password is removed from localStorage (local only)

### 6. Managing Passwords in Google Sheets

**To Add a Password:**
1. Open your Google Sheet
2. Add a new row with:
   - Case Study Name
   - Step Name
   - Password
   - Timestamp (optional)

**To Delete a Password:**
1. Open your Google Sheet
2. Find the row
3. Delete the entire row

**To Update a Password:**
1. Open your Google Sheet
2. Find the row
3. Edit the password cell

### 7. Sheet Structure Example

| caseStudyName | stepName | password | timestamp |
|---------------|----------|----------|-----------|
| House Price Prediction | Step 1: Import Libraries | hP9x2Lm4 | 2026-03-02T10:30:00Z |
| Credit Risk Classification | Step 2: Load Data | cR5k8Nx2 | 2026-03-02T11:00:00Z |
| Early Sepsis Risk Prediction | Step 3: Preprocessing | eS3p7Qm9 | 2026-03-02T11:30:00Z |

### 8. Security Notes

- The Google Apps Script is deployed with "Anyone" access for public viewing
- Only people with the passcode can add/delete passwords through the web interface
- Anyone with access to the Google Sheet can edit passwords directly
- Consider using Google Sheets permissions to control who can edit the sheet

### 9. Troubleshooting

**Passwords not showing:**
- Check if `NEXT_PUBLIC_PASSWORDS_SCRIPT_URL` is set in `.env.local`
- Verify the Google Apps Script is deployed with "Anyone" access
- Check browser console for errors
- Verify the sheet name is exactly "Passwords"

**CORS errors:**
- Make sure the Apps Script is deployed as a Web App
- Ensure "Who has access" is set to "Anyone"
- Try redeploying the Apps Script

**Passwords not updating:**
- The page auto-refreshes every 5 seconds
- Try manually refreshing the page
- Check if the Google Sheet has the correct data
