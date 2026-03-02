import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GOOGLE_APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_PASSWORDS_SCRIPT_URL || '';

export async function GET() {
  try {
    console.log('API Route: GOOGLE_APPS_SCRIPT_URL =', GOOGLE_APPS_SCRIPT_URL);
    
    if (!GOOGLE_APPS_SCRIPT_URL) {
      console.error('API Route: Google Apps Script URL not configured');
      return NextResponse.json({ 
        success: false, 
        error: 'Google Apps Script URL not configured',
        data: []
      });
    }

    console.log('API Route: Fetching from Google Apps Script...');
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API Route: Response status:', response.status);
    const data = await response.json();
    console.log('API Route: Data received:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route: Error fetching passwords:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch passwords',
      data: []
    });
  }
}
