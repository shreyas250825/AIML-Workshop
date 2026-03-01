# Quick Google Sheets Setup (5 Minutes)

Follow these steps to connect your workshop platform to Google Sheets for user storage.

## Step 1: Create Google Sheet (2 minutes)

1. Go to https://sheets.google.com
2. Create a new blank spreadsheet
3. Name it "AI Workshop Users"
4. In cell A1, add these headers (copy-paste the entire row):

```
ID	Name	Email	USN	Password	Role	Created At	Last Login
```

5. Add admin user in row 2:
```
admin-001	Admin User	admin@workshop.com	ADMIN	admin123	admin	2024-01-01T00:00:00.000Z	
```

6. Click "Share" button → "Anyone with the link" → Set to "Viewer" → Done

## Step 2: Get Sheet ID (30 seconds)

Your Google Sheet URL looks like:
```
https://docs.google.com/spreadsheets/d/1abc123xyz456/edit
```

Copy the part between `/d/` and `/edit` - that's your Sheet ID.
Example: `1abc123xyz456`

## Step 3: Get API Key (2 minutes)

1. Go to https://console.cloud.google.com/
2. Create new project (or select existing)
3. Click "Enable APIs and Services"
4. Search "Google Sheets API" → Enable it
5. Go to "Credentials" → "Create Credentials" → "API Key"
6. Copy the API key
7. Click "Edit API key" → Under "API restrictions" → Select "Google Sheets API" → Save

## Step 4: Configure Your App (30 seconds)

1. Create a file named `.env.local` in the `workshop` folder
2. Add these lines (replace with your values):

```env
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here
GOOGLE_SHEETS_API_KEY=your_api_key_here
```

3. Save the file

## Step 5: Restart Server

```bash
npm run dev
```

## Test It!

1. Go to http://localhost:3000/signup
2. Register a new user
3. Check your Google Sheet - new user should appear!
4. Login with the new user
5. Check admin dashboard - all users should be visible

## Troubleshooting

**"Failed to fetch"**
- Make sure Sheet ID is correct
- Check that sheet is shared as "Anyone with link can view"
- Verify sheet name is exactly "Users" (case-sensitive)

**"API Key error"**
- Make sure Google Sheets API is enabled
- Check API key is correct
- Verify API restrictions allow Google Sheets API

**Still not working?**
- The app will fall back to localStorage if Google Sheets fails
- Check browser console for detailed error messages
- Make sure `.env.local` file is in the `workshop` folder (not root)

## Security Notes

- Never commit `.env.local` to git (it's already in .gitignore)
- Sheet is read-only for public (only your API can write)
- For production, add your domain to API key restrictions

## What's Next?

Once working, you can:
- View/edit users directly in Google Sheets
- Export data to Excel/CSV anytime
- Share read-only access with team members
- Set up automatic backups
