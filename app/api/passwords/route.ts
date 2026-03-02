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
    // Add timestamp to prevent caching
    const urlWithTimestamp = `${GOOGLE_APPS_SCRIPT_URL}?t=${Date.now()}`;
    const response = await fetch(urlWithTimestamp, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
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
