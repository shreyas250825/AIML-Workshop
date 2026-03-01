import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '';
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || ''; // Server-side key
const USERS_SHEET = 'Users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { values } = body;

    if (!SHEET_ID || !API_KEY) {
      return NextResponse.json(
        { error: 'Google Sheets not configured' },
        { status: 500 }
      );
    }

    const range = `${USERS_SHEET}!A:H`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=RAW&key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Sheets API error:', error);
      return NextResponse.json(
        { error: 'Failed to append to sheet' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in append route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
