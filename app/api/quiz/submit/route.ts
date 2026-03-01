import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7RWePhH2TyrdUXzq3AFVfwCYpLlnTpfsD2chErov4buxVKhTKarKcDk-gHNeJr2Y/exec';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentName,
      registrationNumber,
      quizTitle,
      score,
      totalQuestions,
      timeTaken,
      submittedAt,
      isAutoSubmit
    } = body;

    // Format time taken as "X min Y sec"
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const timeFormatted = `${minutes} min ${seconds} sec`;

    // Prepare data for Google Apps Script
    // Using field names that match the Google Apps Script: name, regNo
    const quizData = {
      name: studentName,
      regNo: registrationNumber,
      quizTitle,
      score: score.toString(),
      totalQuestions: totalQuestions.toString(),
      timeTaken: timeFormatted,
      submissionType: isAutoSubmit ? 'Auto (Time Up)' : 'Manual'
    };

    // Send to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Apps Script error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save to Google Sheets' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in quiz submit route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
