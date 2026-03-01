import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbymKSyu9y2Cy-PG9kkBvUWC2BHprMBmTaW7mRl2SDDSIz_lgjAM6op1cohIZly8SHZ7/exec';

export async function GET(request: NextRequest) {
  try {
    // Fetch users from Google Apps Script with action parameter
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users from Google Sheets');
    }

    const contentType = response.headers.get('content-type');
    
    // Check if response is HTML (script not configured properly)
    if (contentType && contentType.includes('text/html')) {
      console.error('Google Apps Script returned HTML instead of JSON. Please ensure:');
      console.error('1. The doGet() function is added to your Google Apps Script');
      console.error('2. The script has been redeployed after adding doGet()');
      console.error('3. You are using the latest deployment URL');
      
      return NextResponse.json({
        success: false,
        error: 'Google Apps Script not configured. Please add doGet() function and redeploy.',
        users: [],
      });
    }

    const data = await response.json();

    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error('Expected array from Google Apps Script, got:', typeof data);
      return NextResponse.json({
        success: false,
        error: 'Invalid response format from Google Sheets',
        users: [],
      });
    }

    // Transform the array data into user objects
    // Expected format: [timestamp, name, usn, email, password]
    const users = data.map((row: any[], index: number) => ({
      id: index + 1,
      createdAt: row[0], // Date
      name: row[1],      // Name
      usn: row[2],       // USN
      email: row[3],     // Email
      role: 'student',   // All users from this sheet are students
      lastLogin: null,   // Not tracked yet
    }));

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Return empty array instead of error to prevent UI breaking
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
      users: [],
    });
  }
}
