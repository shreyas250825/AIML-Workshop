import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use proxy to avoid CORS issues
const QUIZ_LEADERBOARD_API = '/api/quiz/leaderboard-proxy';

export async function GET(request: NextRequest) {
  try {
    // Get the origin from headers or construct it
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const origin = `${protocol}://${host}`;
    
    // Fetch data from our proxy
    const response = await fetch(`${origin}${QUIZ_LEADERBOARD_API}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch from proxy:', response.status);
      return NextResponse.json([]);
    }

    const data = await response.json();
    console.log('Leaderboard data from proxy:', data);
    
    // Process and rank the data
    if (!data || !Array.isArray(data)) {
      console.log('Invalid data format:', data);
      return NextResponse.json([]);
    }

    // Parse time string "X min Y sec" to total seconds
    const parseTime = (timeStr: string): number => {
      if (!timeStr) return 999999;
      const match = String(timeStr).match(/(\d+)\s*min\s*(\d+)\s*sec/);
      if (!match) return 999999;
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    };

    // Format and add time in seconds for sorting
    const formattedData = data.map((entry: any) => ({
      studentName: entry.studentName || '',
      registrationNumber: entry.registrationNumber || '',
      score: parseInt(entry.score) || 0,
      totalQuestions: parseInt(entry.totalQuestions) || 15,
      timeTaken: entry.timeTaken || '',
      timeInSeconds: parseTime(entry.timeTaken),
      quizTitle: entry.quizTitle || '',
      submittedAt: entry.submittedAt || ''
    }));

    // Sort by score (descending), then by time (ascending - faster is better)
    formattedData.sort((a, b) => {
      // First compare scores - higher score wins
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, compare time - lower time (faster) wins
      return a.timeInSeconds - b.timeInSeconds;
    });

    // Add ranks
    const rankedLeaderboard = formattedData.map((entry, index) => ({
      rank: index + 1,
      studentName: entry.studentName,
      registrationNumber: entry.registrationNumber,
      score: entry.score,
      totalQuestions: entry.totalQuestions,
      timeTaken: entry.timeTaken,
      quizTitle: entry.quizTitle,
      submittedAt: entry.submittedAt
    }));

    console.log('Ranked leaderboard:', rankedLeaderboard);
    return NextResponse.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json([]);
  }
}
