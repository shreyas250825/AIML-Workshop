import { NextRequest, NextResponse } from 'next/server';
import { quizzes } from '@/data/quizzes';

export async function POST(request: NextRequest) {
  try {
    const { quizId, answers } = await request.json();

    const quiz = quizzes.find(q => q.id === quizId);
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    let correctCount = 0;
    const results: Record<number, { correct: boolean; correctAnswer: string }> = {};

    quiz.questions.forEach(q => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
      }
      results[q.id] = {
        correct: isCorrect,
        correctAnswer: q.correctAnswer
      };
    });

    return NextResponse.json({
      score: correctCount,
      total: quiz.questions.length,
      results
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
