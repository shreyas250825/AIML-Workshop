import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtKXv3WosoYvmVKsl0l-hwr2BTO7faCECypR-JnSzaAwlqnlJ865b0zmACC49dHOeu/exec';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Proxy POST request:', body);
    
    // Forward request to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    console.log('Google Script response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Google Script error response:', text);
      return NextResponse.json(
        { status: 'error', message: 'Authentication service error', details: text },
        { status: 500 }
      );
    }

    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Google Script response data:', data);
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return NextResponse.json(
        { status: 'error', message: 'Invalid response from authentication service' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to authentication service', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    console.log('Proxy GET request, action:', action);
    
    // Forward request to Google Apps Script
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=${action}`, {
      method: 'GET',
      redirect: 'follow',
    });

    console.log('Google Script GET response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Google Script GET error response:', text);
      return NextResponse.json(
        { status: 'error', message: 'Authentication service error', details: text },
        { status: 500 }
      );
    }

    const contentType = response.headers.get('content-type');
    console.log('GET Response content-type:', contentType);
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Google Script GET response data:', data);
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      console.error('Non-JSON GET response:', text);
      return NextResponse.json(
        { status: 'error', message: 'Invalid response from authentication service' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Proxy GET error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to authentication service', error: error.message },
      { status: 500 }
    );
  }
}
