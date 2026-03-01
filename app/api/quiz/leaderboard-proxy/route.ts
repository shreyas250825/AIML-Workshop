import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7RWePhH2TyrdUXzq3AFVfwCYpLlnTpfsD2chErov4buxVKhTKarKcDk-gHNeJr2Y/exec';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching quiz data from Google Apps Script...');
    
    // Fetch data from Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
    });

    console.log('Quiz Google Script response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Quiz Google Script error response:', text);
      return NextResponse.json([]);
    }

    const contentType = response.headers.get('content-type');
    console.log('Quiz Response content-type:', contentType);
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      const rawData = await response.json();
      console.log('Quiz Google Script raw data (first 2 rows):', rawData.slice(0, 2));
      console.log('Total rows:', rawData.length);
      
      // Convert array format to object format
      // Google Script returns: [timestamp, name, regNo, quizTitle, score, totalQuestions, timeTaken, submissionType]
      // Array indices:          [0,         1,    2,     3,         4,     5,              6,         7]
      const formattedData = rawData.map((row: any[], index: number) => {
        const formatted = {
          submittedAt: row[0],
          studentName: row[1],
          registrationNumber: row[2],
          quizTitle: row[3],
          score: row[4],
          totalQuestions: row[5],
          timeTaken: row[6],
          submissionType: row[7]
        };
        
        // Log first entry for debugging
        if (index === 0) {
          console.log('First formatted entry:', formatted);
        }
        
        return formatted;
      });
      
      console.log('Total formatted entries:', formattedData.length);
      return NextResponse.json(formattedData);
    } else {
      const text = await response.text();
      console.error('Non-JSON quiz response:', text);
      return NextResponse.json([]);
    }
  } catch (error: any) {
    console.error('Quiz proxy error:', error);
    return NextResponse.json([]);
  }
}
