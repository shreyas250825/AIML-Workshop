import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GOOGLE_APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_PASSWORDS_SCRIPT_URL || '';

export async function GET() {
  try {
    if (!GOOGLE_APPS_SCRIPT_URL) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Apps Script URL not configured',
        data: []
      });
    }

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch passwords',
      data: []
    });
  }
}
