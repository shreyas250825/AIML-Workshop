'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { quizzes } from '@/data/quizzes-client';

// Hash function for quiz password
function hashPassword(password: string): number {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

// Quiz passwords - different for each quiz
const QUIZ_PASSWORDS: Record<string, number> = {
  'march-3': hashPassword('AIWorkshop2026@Day1Secure#'), // Day 1 Quiz password
  'march-4': hashPassword('MLQuiz2026@Day2Advanced!'), // Day 2 Quiz password
};

const QUIZ_DURATION = 15 * 60; // 15 minutes in seconds

function QuizContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Authentication state
  const [quizAuthStep, setQuizAuthStep] = useState<'info' | 'password' | 'quiz' | 'completed'>('info');
  const [studentName, setStudentName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [quizPassword, setQuizPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Quiz state
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Record<number, { correct: boolean; correctAnswer: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DURATION);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [timeTakenFormatted, setTimeTakenFormatted] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const currentQuiz = quizzes.find(q => q.id === selectedQuiz);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    if (!submitted) {
      setAnswers(prev => ({ ...prev, [questionId]: answer }));
    }
  };

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (!currentQuiz || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const timeTaken = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0;
    
    // Format time as "X min Y sec"
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const timeFormatted = `${minutes} min ${seconds} sec`;
    setTimeTakenFormatted(timeFormatted);
    
    try {
      const response = await fetch('/api/quiz/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: currentQuiz.id,
          answers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to validate quiz');
      }

      const data = await response.json();
      setScore(data.score);
      setResults(data.results);
      setSubmitted(true);

      // Send to Google Sheets
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          registrationNumber,
          quizId: currentQuiz.id,
          quizTitle: currentQuiz.title,
          score: data.score,
          totalQuestions: currentQuiz.questions.length,
          timeTaken,
          submittedAt: new Date().toISOString(),
          isAutoSubmit
        })
      });

      setQuizAuthStep('completed');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuiz, isSubmitting, quizStartTime, answers, studentName, registrationNumber]);

  // Timer effect
  useEffect(() => {
    const handleTimeUp = async () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      await handleSubmit(true);
    };

    if (quizAuthStep === 'quiz' && !submitted && quizStartTime) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [quizAuthStep, submitted, quizStartTime, handleSubmit]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle student info submission
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !registrationNumber.trim()) {
      setAuthError('Please fill in all fields');
      return;
    }
    setAuthError('');
    setQuizAuthStep('password');
  };

  // Handle quiz password verification
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputHash = hashPassword(quizPassword);
    const correctHash = selectedQuiz ? QUIZ_PASSWORDS[selectedQuiz] : 0;
    if (inputHash === correctHash) {
      setAuthError('');
      setQuizAuthStep('quiz');
      setQuizStartTime(Date.now());
    } else {
      setAuthError('Incorrect quiz password');
      setQuizPassword('');
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setResults({});
    setQuizAuthStep('info');
    setStudentName('');
    setRegistrationNumber('');
    setQuizPassword('');
    setTimeRemaining(QUIZ_DURATION);
    setQuizStartTime(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  // Student Info Form
  if (!selectedQuiz || quizAuthStep === 'info') {
    return (
      <div className="min-h-screen bg-white">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Workshop Platform</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">Case Studies</Link>
                <Link href="/leaderboard" className="text-gray-600 hover:text-purple-600 transition-colors">Leaderboard</Link>
                <Link href="/quiz" className="text-purple-600 font-semibold">Quiz</Link>
                <Link href="/doubts" className="text-gray-600 hover:text-purple-600 transition-colors">Doubts</Link>
                <Link href="/materials" className="text-gray-600 hover:text-purple-600 transition-colors">Materials</Link>
                <Link href="/passwords" className="text-gray-600 hover:text-purple-600 transition-colors">Passwords</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {!selectedQuiz ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Workshop Quizzes</h2>
                <p className="text-gray-600 mb-8">Test your knowledge with our daily quizzes</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setSelectedQuiz(quiz.id)}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                          <p className="text-sm text-gray-600">{quiz.date}</p>
                        </div>
                        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {quiz.questions.length} Questions
                        </div>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all">
                        Start Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h2>
                  <form onSubmit={handleInfoSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                      <input type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Enter your registration number" required />
                    </div>
                    {authError && <p className="text-red-600 text-sm">{authError}</p>}
                    <button type="submit" className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all">
                      Continue
                    </button>
                    <button type="button" onClick={() => setSelectedQuiz(null)} className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all">
                      Back to Quizzes
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Password Form
  if (quizAuthStep === 'password') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Password Required</h2>
            <p className="text-gray-600 mb-6">Enter the quiz password provided by your instructor</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Password</label>
                <input type="password" value={quizPassword} onChange={(e) => setQuizPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Enter quiz password" required />
              </div>
              {authError && <p className="text-red-600 text-sm">{authError}</p>}
              <button type="submit" className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all">
                Start Quiz
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Completed
  if (quizAuthStep === 'completed') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-2xl w-full mx-4">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-8 text-center">
            <svg className="w-20 h-20 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h2 className="text-3xl font-bold mb-4">Quiz Submitted Successfully!</h2>
            <div className="bg-white/20 rounded-lg p-6 mb-6 space-y-3">
              <p className="text-xl">Your Score: {score} / {currentQuiz?.questions.length}</p>
              <p className="text-lg">Completed in: {timeTakenFormatted}</p>
            </div>
            <p className="mb-6">Your results have been recorded. Thank you for participating!</p>
            <button onClick={handleBackToQuizzes} className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition-all">
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation with Timer */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentQuiz?.title}</h1>
              <p className="text-sm text-gray-600">{currentQuiz?.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-6 py-2 rounded-lg font-bold text-lg ${timeRemaining < 60 ? 'bg-red-100 text-red-700' : timeRemaining < 300 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-900">
              <span className="font-semibold">Student:</span> {studentName} | <span className="font-semibold">Reg No:</span> {registrationNumber}
            </p>
          </div>

          <div className="space-y-6">
            {currentQuiz?.questions.map((question, qIndex) => {
              const result = results[question.id];
              const isCorrect = result?.correct;
              const isWrong = submitted && answers[question.id] && !isCorrect;
              
              return (
                <div
                  key={question.id}
                  className={`bg-white rounded-xl shadow-lg border-2 p-6 ${
                    isCorrect ? 'border-green-500' : isWrong ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {qIndex + 1}
                    </div>
                    <p className="text-lg text-gray-900 font-medium flex-1">
                      {question.question}
                    </p>
                  </div>

                  <div className="space-y-3 ml-12">
                    {question.options.map((option, oIndex) => {
                      const optionLabel = getOptionLabel(oIndex);
                      const isSelected = answers[question.id] === optionLabel;
                      const isCorrectOption = submitted && result?.correctAnswer === optionLabel;
                      
                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswerSelect(question.id, optionLabel)}
                          disabled={submitted}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            submitted && isCorrectOption
                              ? 'border-green-500 bg-green-50'
                              : submitted && isSelected && !isCorrectOption
                              ? 'border-red-500 bg-red-50'
                              : isSelected
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                              submitted && isCorrectOption
                                ? 'border-green-500 bg-green-500 text-white'
                                : submitted && isSelected && !isCorrectOption
                                ? 'border-red-500 bg-red-500 text-white'
                                : isSelected
                                ? 'border-purple-600 bg-purple-600 text-white'
                                : 'border-gray-400 text-gray-600'
                            }`}>
                              {optionLabel}
                            </div>
                            <span className="text-gray-900">{option}</span>
                            {submitted && isCorrectOption && (
                              <svg className="w-5 h-5 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {!submitted && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => handleSubmit(false)}
                disabled={Object.keys(answers).length !== currentQuiz?.questions.length || isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <QuizContent />
    </ProtectedRoute>
  );
}
