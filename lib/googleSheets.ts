// Google Sheets API Integration for User Management

export interface SheetUser {
  id: string;
  name: string;
  email: string;
  usn: string;
  password: string;
  role: 'student' | 'admin';
  createdAt: string;
  lastLogin: string;
}

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

// Sheet name in your Google Sheet
const USERS_SHEET = 'Users';

/**
 * Fetch all users from Google Sheets
 */
export async function fetchUsersFromSheet(): Promise<SheetUser[]> {
  if (!SHEET_ID || !API_KEY) {
    console.warn('Google Sheets credentials not configured. Using localStorage fallback.');
    return [];
  }

  try {
    const range = `${USERS_SHEET}!A2:H`; // Skip header row
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Sheets: ${response.statusText}`);
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    return rows.map((row: string[]) => ({
      id: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      usn: row[3] || '',
      password: row[4] || '',
      role: (row[5] || 'student') as 'student' | 'admin',
      createdAt: row[6] || new Date().toISOString(),
      lastLogin: row[7] || '',
    }));
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
}

/**
 * Add a new user to Google Sheets
 */
export async function addUserToSheet(user: SheetUser): Promise<boolean> {
  if (!SHEET_ID || !API_KEY) {
    console.warn('Google Sheets credentials not configured.');
    return false;
  }

  try {
    // Use the append endpoint to add a new row
    const range = `${USERS_SHEET}!A:H`;
    const url = `/api/sheets/append`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          user.id,
          user.name,
          user.email,
          user.usn,
          user.password,
          user.role,
          user.createdAt,
          user.lastLogin,
        ]],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add user to Google Sheets: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding user to Google Sheets:', error);
    return false;
  }
}

/**
 * Update user's last login time
 */
export async function updateUserLastLogin(email: string): Promise<boolean> {
  if (!SHEET_ID || !API_KEY) {
    return false;
  }

  try {
    const url = `/api/sheets/update-login`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        lastLogin: new Date().toISOString(),
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error updating last login:', error);
    return false;
  }
}
