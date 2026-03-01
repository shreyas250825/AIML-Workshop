import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '';
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || '';
const USERS_SHEET = 'Users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, lastLogin } = body;

    if (!SHEET_ID || !API_KEY) {
      return NextResponse.json(
        { error: 'Google Sheets not configured' },
        { status: 500 }
      );
    }

    // First, fetch all users to find the row
    const range = `${USERS_SHEET}!A2:H`;
    const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    const fetchResponse = await fetch(fetchUrl);
    if (!fetchResponse.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const data = await fetchResponse.json();
    const rows = data.values || [];
    
    // Find the row index for this email (column C is email, index 2)
    const rowIndex = rows.findIndex((row: string[]) => row[2] === email);
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update the lastLogin column (H, index 7) for this row
    // Row index + 2 because: +1 for header, +1 for 0-based to 1-based
    const updateRange = `${USERS_SHEET}!H${rowIndex + 2}`;
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${updateRange}?valueInputOption=RAW&key=${API_KEY}`;
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[lastLogin]],
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update last login');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in update-login route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
