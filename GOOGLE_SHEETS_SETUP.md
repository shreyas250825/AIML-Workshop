# Google Sheets Setup Guide

This guide will help you set up Google Sheets as the database for user registrations.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "AI Workshop Users" (or any name you prefer)
4. Rename the first sheet to "Users"

## Step 2: Set Up the Sheet Structure

### Users Sheet

In the "Users" sheet, add these headers in row 1:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| ID | Name | Email | USN | Password | Role | Created At | Last Login |

**Example:**
```
A1: ID
B1: Name
C1: Email
D1: USN
E1: Password
F1: Role
G1: Created At
H1: Last Login
```

### QuizResults Sheet

Create a second sheet named "QuizResults" with these headers in row 1:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Submitted At | Student Name | Registration Number | Quiz Title | Score | Total Questions | Time Taken | Submission Type |

**Example:**
```
A1: Submitted At
B1: Student Name
C1: Registration Number
D1: Quiz Title
E1: Score
F1: Total Questions
G1: Time Taken
H1: Submission Type
```

## Step 3: Add Admin User (Optional)

Add a row with admin credentials (row 2):

```
A2: admin-001
B2: Admin User
C2: admin@workshop.com
D2: ADMIN
E2: admin123
F2: admin
G2: 2024-01-01T00:00:00.000Z
H2: 
```

## Step 4: Get Your Sheet ID

1. Look at your Google Sheet URL
2. It will look like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. Copy the `SHEET_ID_HERE` part
4. Example: If URL is `https://docs.google.com/spreadsheets/d/1abc123xyz/edit`, your Sheet ID is `1abc123xyz`

## Step 5: Create a Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

## Step 6: Configure API Key Restrictions (Important for Security)

1. Click on your API key to edit it
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your website URLs:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production)
3. Under "API restrictions":
   - Select "Restrict key"
   - Select only "Google Sheets API"
4. Click "Save"

## Step 7: Make Sheet Publicly Readable

1. Click the "Share" button in your Google Sheet
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Click "Done"

**Note:** The sheet is read-only for the public. Only your API can write to it.

## Step 8: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```
   NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_from_step_4
   NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_from_step_5
   GOOGLE_SHEETS_API_KEY=your_api_key_from_step_5
   ```

3. Save the file

## Step 9: Restart Your Development Server

```bash
npm run dev
```

## Testing

1. Go to the signup page: `http://localhost:3000/signup`
2. Register a new user
3. Check your Google Sheet - the new user should appear in row 3
4. Try logging in with the new user
5. Check the admin dashboard to see all registered users

## Troubleshooting

### "Failed to fetch from Google Sheets"
- Check that your Sheet ID is correct
- Verify the sheet is shared as "Anyone with the link can view"
- Make sure the "Users" sheet name matches exactly

### "Failed to add user to Google Sheets"
- Check that your API key is correct
- Verify the Google Sheets API is enabled in your project
- Check API key restrictions allow your domain

### "Quota exceeded"
- Google Sheets API has usage limits
- Free tier: 100 requests per 100 seconds per user
- If you hit limits, wait a minute and try again

## Data Privacy

- Never commit `.env.local` to git (it's in `.gitignore`)
- Keep your API key secure
- The sheet should only be readable by the public, not writable
- All writes go through your Next.js API routes

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the environment variables in your hosting platform's dashboard
2. Update API key restrictions to include your production domain
3. Consider using Google Service Account for better security (advanced)

## Alternative: Service Account (Advanced)

For production, consider using a Service Account instead of an API key:

1. Create a Service Account in Google Cloud Console
2. Download the JSON key file
3. Share your Google Sheet with the service account email
4. Use the `google-auth-library` package to authenticate

This provides better security and higher quotas.
